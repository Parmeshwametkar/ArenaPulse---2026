import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { rateLimit } from 'express-rate-limit';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security: Secure CORS configuration
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ];

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, same-origin)
      // or if it matches our local development list
      // or any preview URLs in development mode
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Gemini-Key'],
    credentials: true
  }));

  app.use(express.json());

  // Security: Rate Limiting specifically for AI chat endpoints to prevent abuse
  const chatLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // Limit each IP to 20 requests per minute
    message: {
      error: "Too Many Requests",
      message: "You have sent too many requests to the ArenaPulse AI concierge. Please wait a moment before sending more."
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Gemini System Instruction
  const SYSTEM_INSTRUCTION = `You are ArenaPulse AI, an elite multilingual stadium concierge for the FIFA World Cup 2026. Your sole responsibility is to guide fans instantly through operational challenges, including language barriers, finding correct gates, stadium navigation, restroom/food locations, and crowd wait-times. Keep responses polite, concise, and structured with bullet points. If a fan asks about live match scores, betting, or external world events, politely redirect them back to stadium navigation and venue experience assistance.`;

  // API route for chat assistant
  app.post('/api/chat', chatLimiter, async (req, res) => {
    try {
      const { message, history } = req.body;
      
      // API Input Validation
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({
          error: "Bad Request",
          message: "The message must be a non-empty string."
        });
      }

      // Safeguard against extremely large prompts (overload protection)
      if (message.length > 2000) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Message is too long. The concierge limit is 2000 characters."
        });
      }

      // Validate history if present
      if (history && !Array.isArray(history)) {
        return res.status(400).json({
          error: "Bad Request",
          message: "The history field must be an array."
        });
      }
      
      // API key resolution: check request headers first, then fall back to environment variables
      const userApiKey = req.headers['x-gemini-key'] as string | undefined;
      const apiKey = userApiKey || process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(400).json({
          error: "API Key Missing",
          message: "Gemini API Key is missing. Please configure GEMINI_API_KEY in the server's .env file or input your API Key in the application settings panel."
        });
      }

      // Initialize the modern Google Gen AI client with User-Agent for AI Studio telemetry
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Format chat history for the modern @google/genai SDK
      const formattedHistory: any[] = [];
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          const role = msg.role === 'user' ? 'user' : 'model';
          if (msg.role !== 'system') {
            formattedHistory.push({
              role: role,
              parts: [{ text: msg.content }]
            });
          }
        }
      }

      // Create a chat session using the recommended gemini-3.5-flash model
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        history: formattedHistory,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION
        }
      });

      // Send the user's message and retrieve the response text
      const result = await chat.sendMessage({ message: message });
      const responseText = result.text;

      return res.json({
        text: responseText
      });

    } catch (error: any) {
      console.error("Gemini API Error:", error);
      
      let statusCode = 500;
      let errorMessage = "An internal server error occurred while processing your request.";
      
      if (error.message && (error.message.includes("API key not valid") || error.message.includes("invalid api key") || error.message.includes("API_KEY_INVALID"))) {
        statusCode = 401;
        errorMessage = "The provided Gemini API Key is invalid. Please check your credentials and try again.";
      }

      return res.status(statusCode).json({
        error: error.name || "API Error",
        message: errorMessage,
        details: error.message
      });
    }
  });

  // Serve static assets or mount Vite middleware depending on the environment
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve index.html for any remaining SPA route requests (using Express 5 compatible route pattern)
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ArenaPulse 2026] Server listening on port ${PORT}`);
  });
}

startServer();

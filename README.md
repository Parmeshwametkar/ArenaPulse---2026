# ArenaPulse 2026: Smart Stadium Companion

ArenaPulse 2026 is a premium, full-stack, single-page web application designed for FIFA World Cup 2026 fans. It features an athletic, high-energy dark mode aesthetic using deep blues, stadium greens, and neon accents. 

This app is powered by a React (TypeScript + Vite + Tailwind CSS) frontend and an Express backend integrated with the modern Google Gen AI SDK (`gemini-3.5-flash`).

## Features

- **Real-Time Countdown Timer**: Prominently displayed in the sticky header, ticking down to the final match.
- **Live Operations Dashboard**: Monitor stadium capacity, average gate waiting times, active gates, and queue congestion in real time.
- **Interactive Stadium Gate & Wayfinding Map**: A fully interactive SVG schematic map showing Gate A, Gate B, Food Court, Restrooms, and the Emergency Medical Zone. Clicking elements dynamically updates live stadium operational metrics.
- **Multilingual Fan Assistant AI**: A fully conversational assistant powered by Google Gemini 3.5 Flash. Guided by custom instructions, the assistant handles language translation, directions, restroom guides, and queue status, keeping responses structured and concise.
- **Quick-Action Suggestion Chips**: Easily trigger frequent inquiries like "Find Nearest Restroom", "Translate to Spanish", or "Where is Gate C?".
- **API Key UI Settings Panel**: Securely input and save your Gemini API Key directly in the frontend (stored in local storage and transmitted safely via request headers) or configure it on the backend.

## Production Security Hardening

To ensure the application is hackathon-ready and production-ready, we have implemented industry-standard security practices:

1. **Cross-Site Scripting (XSS) Prevention**: The chat markdown renderer on the frontend uses **DOMPurify** to sanitize any parsed HTML output, securing the client against any malicious script injection from AI outputs or custom inputs.
2. **API Rate Limiting**: The backend employs **express-rate-limit** to restrict `/api/chat` requests to 20 per minute per IP, protecting the service from brute-force attacks and API key abuse.
3. **Payload Input Validation**: Restrictive backend validators verify that the user message is a non-empty string, enforce a safe maximum character limit (2000 characters) to prevent prompt overload attacks, and confirm that history arrays are correctly structured.
4. **Secure CORS Configuration**: CORS is explicitly configured to allow local hosts and preview origins while denying unauthorized cross-origin requests.
5. **No Key Leakage**: Stack traces and internal API details are redacted in API error responses.

## Tech Stack

- **Frontend**: React 19, TypeScript 6, Vite 8, Tailwind CSS 3, Lucide Icons, Framer Motion, Marked (for markdown rendering), DOMPurify (for secure HTML sanitization)
- **Backend**: Node.js, Express 5, Google Gen AI SDK (`@google/genai`), dotenv, cors, express-rate-limit, tsx, esbuild (for high-speed production bundling)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A Google Gemini API Key (obtain from [Google AI Studio](https://aistudio.google.com/))

### Installation

1. Clone or navigate to the project directory.
2. Install the project dependencies:
   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the root of the project:
```env
PORT=3000
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
*Note: If `GEMINI_API_KEY` is not defined in the server's `.env`, you can type it directly into the settings panel (gear icon) on the web app top bar.*

### Running the Application

To run the unified full-stack application (frontend + backend assets compiled on-the-fly) on port 3000:
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

### Production Build

To compile the frontend static bundle and compile the TypeScript Express app to a self-contained CommonJS backend:
```bash
npm run build
npm start
```
The server will build the React client and serve it directly from the `dist` directory on the configured `PORT` (default `3000`).

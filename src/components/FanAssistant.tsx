import React, { useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface FanAssistantProps {
  messages: Message[];
  inputValue: string;
  onChangeInput: (val: string) => void;
  onSendMessage: (customMsg?: string) => void;
  isLoading: boolean;
  isApiKeyConfigured: boolean;
  onOpenSettings: () => void;
}

export const FanAssistant: React.FC<FanAssistantProps> = ({
  messages,
  inputValue,
  onChangeInput,
  onSendMessage,
  isLoading,
  isApiKeyConfigured,
  onOpenSettings,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Suggestions chips configurations
  const suggestions = [
    "Find Nearest Restroom",
    "Where is Gate C?",
    "Check Gate B wait time",
    "Translate: 'Where is the food court?' to Spanish",
    "Emergency Medical location"
  ];

  // Scroll to bottom whenever messages change or loading state toggles
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!isLoading) {
      onSendMessage(suggestion);
    }
  };

  // Safe markdown render helper with XSS protection using DOMPurify
  const renderMarkdown = (text: string) => {
    try {
      const parsedHtml = marked.parse(text) as string;
      const cleanHtml = DOMPurify.sanitize(parsedHtml);
      return { __html: cleanHtml };
    } catch {
      return { __html: text }; // fallback
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col h-[520px] sm:h-full border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 relative overflow-hidden group">
      
      {/* Background radial highlight */}
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/10 transition-all duration-500" />

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xs font-bold tracking-widest text-stadium-green uppercase font-mono">
            Card 2 // Concierge
          </h2>
          <h3 className="text-base font-extrabold text-white mt-0.5 tracking-wide flex items-center gap-1.5">
            Multilingual Fan Assistant AI
            <Sparkles className="w-4 h-4 text-stadium-neonCyan animate-pulse" />
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 bg-slate-950 px-2 py-1 rounded-lg border border-slate-900 font-mono">
          <MessageSquare className="w-3.5 h-3.5" />
          CONVERSATION
        </div>
      </div>

      {/* API Key Missing Warning Banner */}
      {!isApiKeyConfigured && (
        <div className="mb-3.5 p-2.5 bg-red-950/20 border border-red-900/30 rounded-xl flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium text-[11px] leading-snug">AI requires an API key to function.</span>
          </div>
          <button 
            onClick={onOpenSettings}
            className="text-[10px] font-black uppercase text-stadium-neonCyan hover:underline shrink-0"
          >
            Configure
          </button>
        </div>
      )}

      {/* Message List Area */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto mb-4 p-3 bg-slate-950/60 border border-slate-900/80 rounded-2xl space-y-3 scrollbar"
      >
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div 
              key={index} 
              className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-lg ${
                  isUser 
                    ? 'bg-slate-900/90 border border-stadium-neonCyan/30 text-white rounded-br-none' 
                    : 'bg-emerald-950/20 border border-emerald-900/35 text-slate-100 rounded-bl-none'
                }`}
              >
                {/* Header (Sender) */}
                <span className={`text-[9px] font-bold font-mono uppercase tracking-wider block mb-1 ${
                  isUser ? 'text-stadium-neonCyan' : 'text-stadium-neonGreen'
                }`}>
                  {isUser ? 'Fan' : 'ArenaPulse AI'}
                </span>
                
                {/* Message Content (Parsed Markdown) */}
                <div 
                  className="prose prose-invert max-w-none text-xs sm:text-sm prose-p:leading-relaxed prose-bullet:my-1 prose-ul:my-1 prose-ul:pl-4 prose-strong:text-white prose-strong:font-bold"
                  dangerouslySetInnerHTML={renderMarkdown(msg.content)}
                />
              </div>
            </div>
          );
        })}

        {/* Loading / Spinner State */}
        {isLoading && (
          <div className="flex w-full justify-start animate-pulse">
            <div className="bg-emerald-950/15 border border-emerald-900/20 text-slate-100 rounded-2xl rounded-bl-none px-4 py-2.5 max-w-[85%] shadow-lg">
              <span className="text-[9px] font-bold font-mono uppercase tracking-wider text-stadium-neonGreen block mb-1">
                ArenaPulse AI
              </span>
              <div className="flex items-center gap-2 py-1 text-slate-400">
                {/* Glowing neon spinner */}
                <div className="w-1.5 h-1.5 rounded-full bg-stadium-neonGreen animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-stadium-neonGreen animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-stadium-neonGreen animate-bounce" style={{ animationDelay: '0.4s' }} />
                <span className="text-[11px] font-mono tracking-widest uppercase ml-1 animate-pulse">Consulting...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion Chips */}
      <div className="mb-4">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono block mb-1.5">
          Quick Inquiries
        </span>
        <div className="flex flex-wrap gap-1.5 max-h-[82px] overflow-y-auto pr-1">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSuggestionClick(suggestion)}
              className="text-[10px] font-bold px-2.5 py-1.5 bg-slate-900 border border-slate-800/80 hover:border-stadium-neonCyan/40 hover:bg-slate-850 hover:text-white text-slate-400 rounded-xl transition-all outline-none truncate max-w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Form Input */}
      <form onSubmit={handleSubmit} className="relative mt-auto">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onChangeInput(e.target.value)}
          placeholder="Ask ArenaPulse AI..."
          disabled={isLoading}
          className="w-full pl-4 pr-12 py-3 bg-slate-950/70 border border-slate-900 focus:border-stadium-neonCyan text-white rounded-xl outline-none transition-all placeholder:text-slate-600 text-xs sm:text-sm focus:shadow-neon-cyan disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="absolute right-1.5 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 rounded-lg hover:shadow-neon-green hover:from-stadium-neonGreen hover:to-emerald-400 transition-all duration-200 outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          aria-label="Send message"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

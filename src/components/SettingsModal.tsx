import React, { useState } from 'react';
import { X, Key, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedApiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  savedApiKey,
  onSaveApiKey,
}) => {
  const [keyInput, setKeyInput] = useState(savedApiKey);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(keyInput.trim());
    setShowSavedMessage(true);
    setTimeout(() => {
      setShowSavedMessage(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div 
        className="w-full max-w-md overflow-hidden glass-panel-neon-cyan rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-stadium-neonCyan animate-pulse" />
            <h2 className="text-lg font-bold tracking-wide text-white uppercase font-mono">
              API Configuration
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold tracking-wider text-slate-300 uppercase font-mono">
              Google Gemini API Key
            </label>
            <p className="text-xs leading-relaxed text-slate-400">
              Provide your Gemini API Key to enable the Fan Assistant AI. The key is stored locally in your browser and sent only to your backend server as a header.
            </p>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-stadium-neonCyan text-white rounded-xl outline-none transition-all placeholder:text-slate-600 font-mono text-sm focus:shadow-neon-cyan"
            />
          </div>

          {/* Quick instructions link */}
          <div className="p-3.5 bg-slate-900/40 rounded-xl border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
            <span className="font-bold text-stadium-green">Don't have a key?</span>
            <br />
            Get a free API key from Google AI Studio. 
            <a 
              href="https://aistudio.google.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="ml-1 text-stadium-neonCyan hover:underline font-semibold"
            >
              Get Gemini Key ↗
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-slate-950 bg-stadium-neonCyan hover:bg-cyan-400 hover:shadow-neon-cyan rounded-xl transition-all duration-200"
            >
              {showSavedMessage ? (
                <>
                  <ShieldCheck className="w-4 h-4 animate-bounce" />
                  Saved!
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

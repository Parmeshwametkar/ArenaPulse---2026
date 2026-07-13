import React, { useState, useEffect } from 'react';
import { Settings, Shield, ShieldAlert, Trophy } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  isApiKeyConfigured: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, isApiKeyConfigured }) => {
  // Let's set the target countdown date: FIFA World Cup 2026 Final 
  // Date: July 19, 2026 at 20:00:00 UTC (16:00 Local/NY time)
  const targetDate = new Date('2026-07-19T20:00:00Z').getTime();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isOver: false
      });
    };

    calculateTimeLeft(); // Initial run
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const padZero = (num: number) => String(num).padStart(2, '0');

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-emerald-950/80 bg-stadium-bg/95 backdrop-blur-md px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center gap-4">
      {/* App Logo & Name */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-950 border border-emerald-400/30 shadow-neon-stadium">
          <Trophy className="w-5.5 h-5.5 text-stadium-neonGreen animate-pulse" />
          <div className="absolute inset-0 rounded-xl border border-stadium-neonGreen/10 animate-ping opacity-45" style={{ animationDuration: '3s' }} />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-black tracking-wider bg-gradient-to-r from-white via-slate-100 to-stadium-neonGreen bg-clip-text text-transparent uppercase font-sans">
              ArenaPulse
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold text-slate-950 bg-stadium-neonGreen rounded font-mono uppercase tracking-wide">
              2026
            </span>
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block -mt-0.5">
            Smart Stadium Companion
          </span>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="flex items-center bg-slate-950/80 border border-emerald-950 rounded-xl px-4 py-1.5 shadow-inner">
        <div className="flex flex-col items-center mr-3">
          <span className="text-[8px] font-bold tracking-wider text-stadium-green uppercase font-sans leading-none">
            Next Match
          </span>
          <span className="text-[9px] font-semibold text-slate-400 uppercase font-mono mt-0.5">
            WC Final
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-stadium-neonGreen font-mono font-bold text-sm sm:text-base tracking-widest">
          {timeLeft.isOver ? (
            <span className="text-glow-green animate-pulse">MATCH IN PROGRESS</span>
          ) : (
            <>
              <div className="flex flex-col items-center">
                <span className="text-glow-green leading-none">{padZero(timeLeft.days)}</span>
                <span className="text-[8px] text-slate-500 font-sans mt-0.5">D</span>
              </div>
              <span className="text-slate-700 -mt-2.5">:</span>
              <div className="flex flex-col items-center">
                <span className="text-glow-green leading-none">{padZero(timeLeft.hours)}</span>
                <span className="text-[8px] text-slate-500 font-sans mt-0.5">H</span>
              </div>
              <span className="text-slate-700 -mt-2.5">:</span>
              <div className="flex flex-col items-center">
                <span className="text-glow-green leading-none">{padZero(timeLeft.minutes)}</span>
                <span className="text-[8px] text-slate-500 font-sans mt-0.5">M</span>
              </div>
              <span className="text-slate-700 -mt-2.5">:</span>
              <div className="flex flex-col items-center">
                <span className="text-glow-green leading-none text-stadium-neonCyan">{padZero(timeLeft.seconds)}</span>
                <span className="text-[8px] text-slate-500 font-sans mt-0.5">S</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* API Configuration & Settings Panel trigger */}
      <div className="flex items-center gap-2.5">
        <div 
          onClick={onOpenSettings}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
            isApiKeyConfigured 
              ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-400 hover:bg-emerald-950/40' 
              : 'bg-red-950/20 border-red-900/40 text-red-400 hover:bg-red-950/40 animate-pulse'
          }`}
          title={isApiKeyConfigured ? "API Key Loaded" : "API Key Missing"}
        >
          {isApiKeyConfigured ? (
            <>
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">AI Active</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Set Key</span>
            </>
          )}
        </div>
        
        <button
          onClick={onOpenSettings}
          className="p-2 text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-stadium-neonCyan rounded-xl hover:shadow-neon-cyan transition-all"
          aria-label="Open settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};

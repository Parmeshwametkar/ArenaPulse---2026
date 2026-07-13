import React, { useEffect, useState } from 'react';
import { Users, Clock, AlertCircle, RefreshCw, Zap, TrendingUp } from 'lucide-react';

interface LiveDashboardProps {
  zoneKey: string;
  zoneName: string;
  capacity: number;
  waitTime: number;
  status: string;
  activeGates: string;
  alertText: string;
  onReset: () => void;
}

export const LiveDashboard: React.FC<LiveDashboardProps> = ({
  zoneKey,
  zoneName,
  capacity,
  waitTime,
  status,
  activeGates,
  alertText,
  onReset,
}) => {
  // Animating capacity and wait time changes
  const [animatedCapacity, setAnimatedCapacity] = useState(capacity);
  const [animatedWaitTime, setAnimatedWaitTime] = useState(waitTime);

  useEffect(() => {
    // Smooth transition simulation for counter numbers
    const capDiff = capacity - animatedCapacity;
    const timeDiff = waitTime - animatedWaitTime;

    const timer = setTimeout(() => {
      if (Math.abs(capDiff) > 0) {
        setAnimatedCapacity(prev => {
          const step = Math.sign(capDiff);
          return Math.abs(capDiff) > 1 ? prev + step * 2 : capacity;
        });
      }
      if (Math.abs(timeDiff) > 0) {
        setAnimatedWaitTime(prev => {
          const step = Math.sign(timeDiff);
          return Math.abs(timeDiff) > 0 ? prev + step : waitTime;
        });
      }
    }, 20);

    return () => clearTimeout(timer);
  }, [capacity, waitTime, animatedCapacity, animatedWaitTime]);

  // Sync state if values change abruptly
  useEffect(() => {
    setAnimatedCapacity(capacity);
    setAnimatedWaitTime(waitTime);
  }, [zoneKey, capacity, waitTime]);

  // Determine status color configurations
  const getStatusConfig = (statusStr: string) => {
    switch (statusStr.toLowerCase()) {
      case 'fluid':
      case 'clear':
      case 'light':
        return {
          bg: 'bg-emerald-950/40 border-emerald-900/50',
          text: 'text-stadium-neonGreen text-glow-green',
          border: 'border-emerald-500/20'
        };
      case 'optimal':
        return {
          bg: 'bg-cyan-950/40 border-cyan-900/50',
          text: 'text-stadium-neonCyan text-glow-cyan',
          border: 'border-cyan-500/20'
        };
      case 'busy':
        return {
          bg: 'bg-amber-950/40 border-amber-900/40',
          text: 'text-amber-400',
          border: 'border-amber-500/20'
        };
      case 'congested':
        return {
          bg: 'bg-rose-950/40 border-rose-900/40',
          text: 'text-rose-400',
          border: 'border-rose-500/20'
        };
      default:
        return {
          bg: 'bg-slate-900/40 border-slate-800',
          text: 'text-slate-300',
          border: 'border-slate-800'
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  // Circular gauge config
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedCapacity / 100) * circumference;

  // Decide circular gauge color
  const getCapacityColor = (cap: number) => {
    if (cap >= 90) return '#f43f5e'; // rose-500
    if (cap >= 75) return '#fbbf24'; // amber-400
    return '#00f2fe'; // neonCyan
  };

  const gaugeColor = getCapacityColor(animatedCapacity);

  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col h-full border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 relative overflow-hidden group">
      
      {/* Visual background ambient glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-500" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/10 transition-all duration-500" />

      {/* Header section */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xs font-bold tracking-widest text-stadium-green uppercase font-mono">
            Card 1 // Operations
          </h2>
          <h3 className="text-base font-extrabold text-white mt-0.5 tracking-wide">
            Live Operations Dashboard
          </h3>
        </div>
        {zoneKey !== 'stadium' && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-stadium-neonCyan border border-cyan-950 hover:border-stadium-neonCyan/30 bg-cyan-950/20 hover:bg-cyan-950/40 rounded-lg transition-all"
            title="Reset to Stadium Overview"
          >
            <RefreshCw className="w-3 h-3" />
            Reset Overview
          </button>
        )}
      </div>

      {/* Selected Location Tracker Tag */}
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-950/70 border border-slate-900 rounded-xl mb-5">
        <span className="w-2 h-2 rounded-full bg-stadium-neonGreen animate-ping" />
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">
          Monitoring Location:
        </span>
        <span className="text-xs font-bold text-white tracking-wide">
          {zoneName}
        </span>
      </div>

      {/* Main metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center flex-grow">
        
        {/* Capacity circular gauge container */}
        <div className="flex flex-col items-center justify-center p-3 bg-slate-950/30 border border-slate-900/60 rounded-2xl relative">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-stadium-neonCyan" />
            Capacity
          </span>
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke={gaugeColor}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500 ease-out"
                strokeLinecap="round"
                style={{
                  filter: `drop-shadow(0 0 5px ${gaugeColor}40)`
                }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black font-mono tracking-tight text-white">
                {animatedCapacity}%
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider -mt-1">
                occupied
              </span>
            </div>
          </div>
        </div>

        {/* Queue time and wait dynamics */}
        <div className="space-y-3.5">
          {/* Average Wait Time */}
          <div className="p-3.5 bg-slate-950/40 border border-slate-900 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-indigo-950/50 border border-indigo-900/40 text-stadium-neonCyan rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
                Avg Gate Wait Time
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black font-mono text-white tracking-tight">
                  {animatedWaitTime}
                </span>
                <span className="text-xs font-semibold text-slate-400">mins</span>
              </div>
            </div>
          </div>

          {/* Active Gates */}
          <div className="p-3.5 bg-slate-950/40 border border-slate-900 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-stadium-neonGreen" />
              <span className="text-xs font-semibold text-slate-400">Active Gates</span>
            </div>
            <span className="text-sm font-black font-mono text-white bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
              {activeGates}
            </span>
          </div>

          {/* Status Badge */}
          <div className={`p-3.5 border rounded-2xl flex items-center justify-between transition-all duration-300 ${statusConfig.bg}`}>
            <span className="text-xs font-semibold text-slate-400">Congestion Level</span>
            <span className={`text-xs font-bold font-mono uppercase px-2.5 py-0.5 rounded-lg bg-black/40 border border-white/5 ${statusConfig.text}`}>
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Alerts or operational recommendation */}
      <div className="mt-5 p-3 bg-slate-950/50 border border-slate-900 rounded-xl flex items-start gap-2 text-xs">
        <AlertCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <p className="text-slate-400 leading-relaxed">
          <span className="font-semibold text-white">Live Advisory:</span> {alertText}
        </p>
      </div>

      {/* Operational flow indicator */}
      <div className="mt-4 pt-3.5 border-t border-slate-900/80 flex items-center justify-between text-[10px] font-bold text-slate-500 font-mono">
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-stadium-green" />
          FLOW INDEX: NORMAL
        </span>
        <span>REFRESH: AUTO (5S)</span>
      </div>
    </div>
  );
};

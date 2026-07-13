import React from 'react';
import { Navigation, Eye } from 'lucide-react';

interface StadiumMapProps {
  selectedZone: string;
  onSelectZone: (zoneKey: string) => void;
}

export const StadiumMap: React.FC<StadiumMapProps> = ({
  selectedZone,
  onSelectZone,
}) => {
  // Mapping zones for labels and icons
  const zones = [
    { key: 'gate_a', label: 'Gate A (North)', color: 'from-emerald-500/20 to-emerald-950/20 border-emerald-500/30 text-emerald-400 hover:border-emerald-400' },
    { key: 'gate_b', label: 'Gate B (South)', color: 'from-cyan-500/20 to-cyan-950/20 border-cyan-500/30 text-cyan-400 hover:border-cyan-400' },
    { key: 'food_court', label: 'Concessions / Food Court', color: 'from-amber-500/20 to-amber-950/20 border-amber-500/30 text-amber-400 hover:border-amber-400' },
    { key: 'restrooms', label: 'West Restrooms', color: 'from-purple-500/20 to-purple-950/20 border-purple-500/30 text-purple-400 hover:border-purple-400' },
    { key: 'emergency_medical', label: 'Medical Station', color: 'from-rose-500/20 to-rose-950/20 border-rose-500/30 text-rose-400 hover:border-rose-400' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col h-full border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 relative overflow-hidden group">
      
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-500" />

      {/* Title */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xs font-bold tracking-widest text-stadium-green uppercase font-mono">
            Card 3 // Wayfinding
          </h2>
          <h3 className="text-base font-extrabold text-white mt-0.5 tracking-wide">
            Interactive Gate & Wayfinding Map
          </h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold bg-slate-950 px-2 py-1 rounded-lg border border-slate-900 font-mono">
          <Navigation className="w-3.5 h-3.5 text-stadium-neonCyan animate-pulse" />
          INTERACTIVE SVG
        </div>
      </div>

      {/* SVG Map Container */}
      <div className="relative flex items-center justify-center flex-grow bg-slate-950/80 border border-slate-900 rounded-2xl p-4 overflow-hidden min-h-[250px] shadow-inner">
        
        {/* Custom Grid Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        {/* Stadium Map SVG */}
        <svg 
          viewBox="0 0 500 320" 
          className="w-full max-w-[420px] h-auto drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10"
        >
          {/* Defs for gradients/glows */}
          <defs>
            <radialGradient id="pitchGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
            </radialGradient>
            <filter id="neonGlowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="neonGlowGreen" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Stadium Outer Ring Structure */}
          <rect 
            x="30" 
            y="20" 
            width="440" 
            height="280" 
            rx="140" 
            className="fill-slate-900/40 stroke-slate-800" 
            strokeWidth="3" 
          />

          {/* Stadium Seating Bowl Middle Ring */}
          <rect 
            x="70" 
            y="50" 
            width="360" 
            height="220" 
            rx="110" 
            className="fill-slate-950/90 stroke-slate-800/80" 
            strokeWidth="2" 
          />
          
          {/* Seating Sectors Dividers (Visual Layout) */}
          <path d="M 250 20 L 250 50" className="stroke-slate-800/50" strokeWidth="1" />
          <path d="M 250 270 L 250 300" className="stroke-slate-800/50" strokeWidth="1" />
          <path d="M 30 160 L 70 160" className="stroke-slate-800/50" strokeWidth="1" />
          <path d="M 430 160 L 470 160" className="stroke-slate-800/50" strokeWidth="1" />

          {/* Concentric Bowl Ring (Infield track boundary) */}
          <rect 
            x="110" 
            y="80" 
            width="280" 
            height="160" 
            rx="80" 
            className="fill-transparent stroke-slate-800/40" 
            strokeWidth="1.5" 
          />

          {/* Pitch Ambient Glow */}
          <rect 
            x="160" 
            y="110" 
            width="180" 
            height="100" 
            rx="6"
            fill="url(#pitchGlow)"
          />

          {/* Soccer Pitch Center Field (Athletic Branding) */}
          <rect 
            x="170" 
            y="115" 
            width="160" 
            height="90" 
            rx="4"
            className="fill-emerald-950/40 stroke-emerald-500/40" 
            strokeWidth="1.5" 
          />
          {/* Pitch Lines */}
          <line x1="250" y1="115" x2="250" y2="205" className="stroke-emerald-500/40" strokeWidth="1.5" />
          <circle cx="250" cy="160" r="22" className="fill-transparent stroke-emerald-500/40" strokeWidth="1.5" />
          <circle cx="250" cy="160" r="2" className="fill-emerald-500/60" />
          {/* Goal Boxes */}
          <rect x="170" y="140" width="16" height="40" className="fill-transparent stroke-emerald-500/40" strokeWidth="1.5" />
          <rect x="314" y="140" width="16" height="40" className="fill-transparent stroke-emerald-500/40" strokeWidth="1.5" />

          {/* ================= INTERACTIVE ZONES ================= */}

          {/* ZONE 1: Gate A (North Entrance) */}
          <g 
            onClick={() => onSelectZone('gate_a')} 
            className="cursor-pointer group/gatea"
          >
            {/* Clickable Area Background */}
            <path 
              d="M 200 20 A 140 140 0 0 1 300 20 L 290 50 A 110 110 0 0 0 210 50 Z" 
              fill={selectedZone === 'gate_a' ? '#10b981' : '#1e293b'}
              fillOpacity={selectedZone === 'gate_a' ? '0.25' : '0.1'}
              className="transition-all duration-300 stroke-emerald-500/30 group-hover/gatea:fill-emerald-500/20 group-hover/gatea:stroke-emerald-400/60"
              strokeWidth={selectedZone === 'gate_a' ? '2' : '1'}
            />
            {/* Gate indicator dot */}
            <circle 
              cx="250" 
              cy="28" 
              r="4" 
              className={`transition-all duration-300 ${
                selectedZone === 'gate_a' 
                  ? 'fill-stadium-neonGreen shadow-neon-green' 
                  : 'fill-emerald-500 group-hover/gatea:fill-stadium-neonGreen'
              }`}
              style={{ filter: selectedZone === 'gate_a' ? 'url(#neonGlowGreen)' : 'none' }}
            />
            <text 
              x="250" 
              y="44" 
              textAnchor="middle" 
              className={`text-[9px] font-bold font-mono transition-colors tracking-wider uppercase pointer-events-none select-none ${
                selectedZone === 'gate_a' ? 'fill-stadium-neonGreen font-extrabold' : 'fill-slate-400 group-hover/gatea:fill-white'
              }`}
            >
              Gate A
            </text>
          </g>

          {/* ZONE 2: Gate B (South Entrance) */}
          <g 
            onClick={() => onSelectZone('gate_b')} 
            className="cursor-pointer group/gateb"
          >
            <path 
              d="M 200 300 A 140 140 0 0 0 300 300 L 290 270 A 110 110 0 0 1 210 270 Z" 
              fill={selectedZone === 'gate_b' ? '#00f2fe' : '#1e293b'}
              fillOpacity={selectedZone === 'gate_b' ? '0.25' : '0.1'}
              className="transition-all duration-300 stroke-cyan-500/30 group-hover/gateb:fill-cyan-500/20 group-hover/gateb:stroke-cyan-400/60"
              strokeWidth={selectedZone === 'gate_b' ? '2' : '1'}
            />
            <circle 
              cx="250" 
              cy="292" 
              r="4" 
              className={`transition-all duration-300 ${
                selectedZone === 'gate_b' 
                  ? 'fill-stadium-neonCyan' 
                  : 'fill-cyan-500 group-hover/gateb:fill-stadium-neonCyan'
              }`}
              style={{ filter: selectedZone === 'gate_b' ? 'url(#neonGlowCyan)' : 'none' }}
            />
            <text 
              x="250" 
              y="284" 
              textAnchor="middle" 
              className={`text-[9px] font-bold font-mono transition-colors tracking-wider uppercase pointer-events-none select-none ${
                selectedZone === 'gate_b' ? 'fill-stadium-neonCyan font-extrabold' : 'fill-slate-400 group-hover/gateb:fill-white'
              }`}
            >
              Gate B
            </text>
          </g>

          {/* ZONE 3: Food Court (Top Left Concourse) */}
          <g 
            onClick={() => onSelectZone('food_court')} 
            className="cursor-pointer group/food"
          >
            <path 
              d="M 65 75 A 140 140 0 0 1 150 25 L 170 52 A 110 110 0 0 0 98 90 Z" 
              fill={selectedZone === 'food_court' ? '#fbbf24' : '#1e293b'}
              fillOpacity={selectedZone === 'food_court' ? '0.25' : '0.1'}
              className="transition-all duration-300 stroke-amber-500/30 group-hover/food:fill-amber-500/20 group-hover/food:stroke-amber-400/60"
              strokeWidth={selectedZone === 'food_court' ? '2' : '1'}
            />
            <text 
              x="115" 
              y="55" 
              textAnchor="middle" 
              transform="rotate(-25, 115, 55)"
              className={`text-[9px] font-bold font-mono transition-colors tracking-wider uppercase pointer-events-none select-none ${
                selectedZone === 'food_court' ? 'fill-amber-400 font-extrabold' : 'fill-slate-400 group-hover/food:fill-white'
              }`}
            >
              Food Court
            </text>
          </g>

          {/* ZONE 4: Restrooms (Bottom Left Concourse) */}
          <g 
            onClick={() => onSelectZone('restrooms')} 
            className="cursor-pointer group/rest"
          >
            <path 
              d="M 65 245 A 140 140 0 0 0 150 295 L 170 268 A 110 110 0 0 1 98 230 Z" 
              fill={selectedZone === 'restrooms' ? '#c084fc' : '#1e293b'}
              fillOpacity={selectedZone === 'restrooms' ? '0.25' : '0.1'}
              className="transition-all duration-300 stroke-purple-500/30 group-hover/rest:fill-purple-500/20 group-hover/rest:stroke-purple-400/60"
              strokeWidth={selectedZone === 'restrooms' ? '2' : '1'}
            />
            <text 
              x="115" 
              y="270" 
              textAnchor="middle" 
              transform="rotate(25, 115, 270)"
              className={`text-[9px] font-bold font-mono transition-colors tracking-wider uppercase pointer-events-none select-none ${
                selectedZone === 'restrooms' ? 'fill-purple-400 font-extrabold' : 'fill-slate-400 group-hover/rest:fill-white'
              }`}
            >
              Restrooms
            </text>
          </g>

          {/* ZONE 5: Emergency Medical (Right/East Concourse) */}
          <g 
            onClick={() => onSelectZone('emergency_medical')} 
            className="cursor-pointer group/med"
          >
            <path 
              d="M 435 100 A 140 140 0 0 1 435 220 L 405 200 A 110 110 0 0 0 405 120 Z" 
              fill={selectedZone === 'emergency_medical' ? '#f43f5e' : '#1e293b'}
              fillOpacity={selectedZone === 'emergency_medical' ? '0.25' : '0.1'}
              className="transition-all duration-300 stroke-rose-500/30 group-hover/med:fill-rose-500/20 group-hover/med:stroke-rose-400/60"
              strokeWidth={selectedZone === 'emergency_medical' ? '2' : '1'}
            />
            {/* Red cross representation */}
            <path 
              d="M 425 152.5 L 429 152.5 L 429 148.5 L 433 148.5 L 433 152.5 L 437 152.5 L 437 156.5 L 433 156.5 L 433 160.5 L 429 160.5 L 429 156.5 L 425 156.5 Z" 
              className={`transition-colors duration-300 ${
                selectedZone === 'emergency_medical' ? 'fill-rose-500' : 'fill-rose-600/70 group-hover/med:fill-rose-500'
              }`}
            />
            <text 
              x="395" 
              y="163" 
              textAnchor="middle" 
              transform="rotate(90, 390, 160)"
              className={`text-[9px] font-bold font-mono transition-colors tracking-wider uppercase pointer-events-none select-none ${
                selectedZone === 'emergency_medical' ? 'fill-rose-400 font-extrabold' : 'fill-slate-400 group-hover/med:fill-white'
              }`}
            >
              Medical Zone
            </text>
          </g>

        </svg>

        {/* Hover/Interact Tip */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 border border-slate-800 rounded-full text-[10px] text-slate-400 font-semibold font-sans backdrop-blur-md">
          <Eye className="w-3.5 h-3.5 text-stadium-neonCyan" />
          Click a colored stadium zone to filter metrics
        </div>
      </div>

      {/* Quick reference key list */}
      <div className="mt-4 space-y-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono block">
          Stadium Zone Quick Select
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {zones.map((zone) => (
            <button
              key={zone.key}
              onClick={() => onSelectZone(zone.key)}
              className={`px-2.5 py-1.5 text-[10px] font-bold rounded-xl border bg-gradient-to-b transition-all text-left truncate flex items-center justify-between ${
                selectedZone === zone.key
                  ? 'border-stadium-neonCyan ring-1 ring-stadium-neonCyan/30 shadow-neon-cyan text-white bg-slate-900'
                  : 'bg-slate-950/40 hover:bg-slate-900 border-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <span>{zone.label.split(' (')[0]}</span>
              {selectedZone === zone.key && (
                <span className="w-1.5 h-1.5 rounded-full bg-stadium-neonCyan" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, Trophy, Flag, Sparkles, Lock, Unlock, Zap, Shield, Flame, Star, Award, Route } from 'lucide-react';

interface LevelRoadModalProps {
  currentMaxLevel: number;
  onClose: () => void;
  onStartGame: () => void;
}

export interface LevelMilestone {
  level: number;
  title: string;
  zoneName: string;
  badge: string;
  color: string;
  borderColor: string;
  bgGlow: string;
  description: string;
  unlockedFeatures: string[];
}

export const LEVEL_MILESTONES: LevelMilestone[] = [
  {
    level: 1,
    title: 'Neon Rookie',
    zoneName: 'Neon Alley',
    badge: '🌱',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/50',
    bgGlow: 'bg-cyan-950/40',
    description: 'Master the basics of Moonwalk jumping and sliding under plasma lasers.',
    unlockedFeatures: ['Base Speed (6.5)', 'Plasma Spikes', 'Cyber Lasers'],
  },
  {
    level: 10,
    title: 'Grid Runner',
    zoneName: 'Cyber Grid',
    badge: '⚡',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/50',
    bgGlow: 'bg-emerald-950/40',
    description: 'Speed increases by +15%. Flying patrol drones begin spawning.',
    unlockedFeatures: ['Speed +15%', 'Patrol Drones', 'Shield Orbs'],
  },
  {
    level: 25,
    title: 'Smooth Moonwalker',
    zoneName: 'Moonwalk Boulevard',
    badge: '💫',
    color: 'text-fuchsia-400',
    borderColor: 'border-fuchsia-500/50',
    bgGlow: 'bg-fuchsia-950/40',
    description: 'High-speed rhythm zone with score multipliers and double-jump challenges.',
    unlockedFeatures: ['Score Multiplier Orbs 3X', 'Double Jump Mastery', 'Gold Orbs'],
  },
  {
    level: 50,
    title: 'Thriller Master',
    zoneName: 'Thriller Highway',
    badge: '🔥',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/50',
    bgGlow: 'bg-amber-950/40',
    description: 'Glitch walls and rapid laser barriers. High combo multipliers rewarded.',
    unlockedFeatures: ['Glitch Wall Barriers', 'Magnet Surge Orbs', 'Speed +50%'],
  },
  {
    level: 75,
    title: 'Dangerous Agent',
    zoneName: 'Dangerous Zone',
    badge: '💥',
    color: 'text-rose-400',
    borderColor: 'border-rose-500/50',
    bgGlow: 'bg-rose-950/40',
    description: 'Extreme hazard density. Requires reflex ducking, jumping, and shield timing.',
    unlockedFeatures: ['Extreme Speed', 'Rapid Hazards', 'Ultra Combo Multiplier'],
  },
  {
    level: 100,
    title: 'MJ Cyber Legend',
    zoneName: 'Legendary Apex',
    badge: '👑',
    color: 'text-yellow-300',
    borderColor: 'border-yellow-400/80',
    bgGlow: 'bg-yellow-950/50',
    description: 'The ultimate 100-level pinnacle! Maximum speed, golden trails, and legendary glory.',
    unlockedFeatures: ['Max Cyber Speed (18.5)', 'Legendary Hall of Fame', 'Golden Cyber Aura'],
  },
];

export const LevelRoadModal: React.FC<LevelRoadModalProps> = ({
  currentMaxLevel,
  onClose,
  onStartGame,
}) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md select-none">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl text-white flex flex-col gap-4 max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-fuchsia-950/80 rounded-xl border border-fuchsia-500/50 text-fuchsia-400">
              <Route className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-cyan-300 tracking-wide flex items-center gap-2">
                <span>100 LEVELS ROAD MAP</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-400/50 text-cyan-300">
                  ROAD JOURNEY
                </span>
              </h2>
              <p className="text-[11px] text-gray-400 font-mono">
                Your Highest Level Reached:{' '}
                <span className="text-emerald-400 font-bold">Level {currentMaxLevel} / 100</span>
              </p>
            </div>
          </div>

          <button
            id="level-road-close-btn"
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Road Scrollable Map Container */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 py-2">
          {/* Level Progress Bar Overview */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-gray-300 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>CYBER ROAD PROGRESSION</span>
              </span>
              <span className="font-mono text-cyan-300">
                {Math.min(100, Math.round((currentMaxLevel / 100) * 100))}% Completed
              </span>
            </div>

            <div className="w-full h-3 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(0,243,255,0.6)]"
                style={{ width: `${Math.min(100, (currentMaxLevel / 100) * 100)}%` }}
              />
            </div>
          </div>

          {/* Road Visual Timeline Steps (Levels 1 to 100) */}
          <div className="relative pl-6 sm:pl-8 border-l-2 border-dashed border-slate-700/80 my-2 flex flex-col gap-5">
            {LEVEL_MILESTONES.map((item) => {
              const isUnlocked = currentMaxLevel >= item.level;
              const isCurrent =
                currentMaxLevel >= item.level &&
                (item.level === 100 || currentMaxLevel < (LEVEL_MILESTONES.find((m) => m.level > item.level)?.level || 101));

              return (
                <div key={item.level} className="relative flex flex-col gap-1 group">
                  {/* Road Node Marker Pin */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center font-black text-xs transition shadow-lg ${
                      isUnlocked
                        ? 'bg-slate-900 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.5)]'
                        : 'bg-slate-950 border-slate-700 text-gray-600'
                    }`}
                  >
                    {isUnlocked ? item.badge : <Lock className="w-3.5 h-3.5" />}
                  </div>

                  {/* Level Card */}
                  <div
                    className={`p-3.5 rounded-2xl border transition flex flex-col gap-2 ${
                      isCurrent
                        ? 'bg-slate-900/90 border-cyan-400 shadow-[0_0_20px_rgba(0,243,255,0.25)]'
                        : isUnlocked
                        ? `${item.bgGlow} ${item.borderColor}`
                        : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-black text-xs sm:text-sm ${item.color}`}>
                          LEVEL {item.level}
                        </span>
                        <span className="text-xs font-extrabold text-white">{item.zoneName}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black text-[9px] uppercase tracking-wider animate-pulse">
                            YOU ARE HERE
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-mono font-bold">
                        {isUnlocked ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <Unlock className="w-3 h-3" /> UNLOCKED
                          </span>
                        ) : (
                          <span className="text-gray-500 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> LOCKED
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-gray-300">{item.description}</p>

                    {/* Features Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.unlockedFeatures.map((feat, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px] text-gray-300 font-mono flex items-center gap-1"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                          <span>{feat}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 100 Levels Milestone Table Grid Quick Peek */}
          <div className="mt-2 p-3 bg-slate-950/90 border border-slate-800 rounded-2xl flex flex-col gap-2">
            <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-fuchsia-400" />
              <span>100 LEVELS MILESTONE ROADMAP</span>
            </span>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 text-center font-mono text-[10px]">
              {Array.from({ length: 10 }).map((_, idx) => {
                const targetLvl = (idx + 1) * 10;
                const isPassed = currentMaxLevel >= targetLvl;

                return (
                  <div
                    key={targetLvl}
                    className={`py-1.5 px-1 rounded-xl border flex flex-col items-center gap-0.5 ${
                      isPassed
                        ? 'bg-cyan-950/80 border-cyan-400/60 text-cyan-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-gray-600'
                    }`}
                  >
                    <span>L{targetLvl}</span>
                    <span className="text-[9px]">{isPassed ? '✓' : '🔒'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-800 flex gap-3">
          <button
            id="level-road-start-btn"
            onClick={() => {
              onClose();
              onStartGame();
            }}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(255,0,255,0.6)] active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Flame className="w-4 h-4 fill-slate-950" />
            <span>PLAY ON THE CYBER ROAD</span>
          </button>
        </div>
      </div>
    </div>
  );
};

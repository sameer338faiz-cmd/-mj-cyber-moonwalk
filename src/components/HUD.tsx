import React from 'react';
import { Pause, Play, Volume2, VolumeX, Shield, Zap } from 'lucide-react';
import { GameStats, PowerUpType } from '../types';

interface HUDProps {
  stats: GameStats;
  isPaused: boolean;
  onTogglePause: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
  onOpenSettings: () => void;
  onOpenLevelRoad?: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  isPaused,
  onTogglePause,
  onToggleMute,
  isMuted,
  onOpenSettings,
  onOpenLevelRoad,
}) => {
  const getPowerUpLabel = (type: PowerUpType) => {
    switch (type) {
      case 'shield':
        return 'NEON SHIELD';
      case 'multiplier':
        return '3X SCORE MULTIPLIER';
      case 'magnet':
        return 'MAGNET SURGE';
      case 'gravity':
        return 'MOONWALK FLOAT';
      case 'blast':
        return 'BLAST WAVE (PRESS SHIFT)';
    }
  };

  const getPowerUpColor = (type: PowerUpType) => {
    switch (type) {
      case 'shield':
        return 'bg-cyan-500 border-cyan-300 text-cyan-100 shadow-cyan-500/50';
      case 'multiplier':
        return 'bg-amber-500 border-amber-300 text-amber-100 shadow-amber-500/50';
      case 'magnet':
        return 'bg-rose-500 border-rose-300 text-rose-100 shadow-rose-500/50';
      case 'gravity':
        return 'bg-purple-500 border-purple-300 text-purple-100 shadow-purple-500/50';
      case 'blast':
        return 'bg-emerald-500 border-emerald-300 text-emerald-100 shadow-emerald-500/50';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none p-2.5 sm:p-3.5 flex flex-col justify-between select-none">
      {/* Top Header Bar */}
      <div className="flex items-start justify-between">
        {/* Left: Score & Distance */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">SCORE</span>
            <span className="text-2xl sm:text-3xl font-extrabold tracking-wider text-white drop-shadow-[0_0_10px_rgba(0,243,255,0.8)] font-mono">
              {stats.score.toLocaleString()}
            </span>

            {/* Score Multiplier Badge */}
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-300 text-[10px] font-mono font-black shadow-[0_0_8px_rgba(245,158,11,0.4)] animate-pulse">
              ⚡ {stats.currentMultiplier || 1.0}x
            </span>
          </div>

          {stats.highScoreBeaten && (
            <div className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-400/80 px-1.5 py-0.2 rounded animate-bounce">
              👑 RECORD RUN!
            </div>
          )}

          <div className="flex items-center gap-3 text-xs font-mono text-cyan-200/90">
            <div>
              <span className="text-gray-400 text-[10px]">DIST: </span>
              <span className="font-bold">{Math.round(stats.distance)}m</span>
            </div>
            <div>
              <span className="text-gray-400 text-[10px]">SPD: </span>
              <span className="font-bold text-fuchsia-400">{stats.speed}x</span>
            </div>
            <div>
              <span className="text-gray-400 text-[10px]">ORBS: </span>
              <span className="font-bold text-amber-300">💎 {stats.orbsCollected}</span>
            </div>
          </div>

          {/* Level 1-100 Progress Bar */}
          <button
            id="hud-level-road-btn"
            onClick={onOpenLevelRoad}
            className="flex items-center gap-1.5 mt-0.5 cursor-pointer hover:opacity-90 transition pointer-events-auto"
            title="Click to view 100 Level Road Map"
          >
            <span className="px-1.5 py-0.2 rounded bg-emerald-950/90 border border-emerald-400/60 text-emerald-300 font-extrabold text-[10px] font-mono shadow-[0_0_8px_rgba(0,255,136,0.3)] flex items-center gap-1">
              <span>LVL {stats.level}/100</span>
              <span className="text-[8px] text-cyan-400">🗺️</span>
            </span>

            <div className="w-16 sm:w-24 h-1.5 bg-slate-900 border border-slate-700 rounded-full overflow-hidden p-0.2">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-fuchsia-500 rounded-full transition-all duration-200"
                style={{
                  width: `${((stats.distance % 100) / 100) * 100}%`,
                }}
              />
            </div>
          </button>
        </div>

        {/* Center: Combo & Active Status */}
        <div className="flex flex-col items-center">
          {stats.combo > 1 && (
            <div className="animate-bounce flex items-center gap-1 bg-fuchsia-900/80 border border-fuchsia-400 px-2 py-0.5 rounded-full text-fuchsia-200 font-bold text-xs shadow-[0_0_10px_rgba(255,0,255,0.6)]">
              <Zap className="w-3.5 h-3.5 text-fuchsia-300 fill-fuchsia-300" />
              <span>x{stats.combo}!</span>
            </div>
          )}

          {stats.hasShield && (
            <div className="mt-0.5 flex items-center gap-1 bg-cyan-950/80 border border-cyan-400 px-2 py-0.5 rounded-full text-cyan-200 text-[10px] font-semibold shadow-[0_0_8px_rgba(0,255,255,0.4)]">
              <Shield className="w-3 h-3 text-cyan-300 fill-cyan-300" />
              <span>SHIELD</span>
            </div>
          )}
        </div>

        {/* Right: Pause & Control Buttons */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            id="hud-mute-btn"
            onClick={onToggleMute}
            className="p-1.5 rounded-lg bg-slate-900/80 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 hover:bg-slate-800 transition active:scale-95 shadow-md backdrop-blur-sm cursor-pointer"
            title="Toggle Mute"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            id="hud-pause-btn"
            onClick={onTogglePause}
            className="p-1.5 rounded-lg bg-slate-900/80 border border-fuchsia-500/30 text-fuchsia-300 hover:border-fuchsia-400 hover:bg-slate-800 transition active:scale-95 shadow-md backdrop-blur-sm cursor-pointer"
            title={isPaused ? 'Resume Game' : 'Pause Game'}
          >
            {isPaused ? <Play className="w-4 h-4 fill-fuchsia-300" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bottom Power-Up Progress Bar */}
      {stats.activePowerUp && (
        <div className="self-center w-full max-w-xs pointer-events-none mb-1">
          <div className="flex justify-between items-center text-[10px] font-bold mb-0.5 tracking-wider">
            <span className="text-white drop-shadow">{getPowerUpLabel(stats.activePowerUp.type)}</span>
            <span className="text-gray-300 font-mono">
              {(stats.activePowerUp.remainingTime / 1000).toFixed(1)}s
            </span>
          </div>

          <div className="h-1.5 w-full bg-slate-900/90 rounded-full border border-white/20 overflow-hidden shadow-inner p-0.2">
            <div
              className={`h-full rounded-full transition-all duration-75 shadow-lg ${getPowerUpColor(
                stats.activePowerUp.type
              )}`}
              style={{
                width: `${Math.max(0, (stats.activePowerUp.remainingTime / stats.activePowerUp.duration) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

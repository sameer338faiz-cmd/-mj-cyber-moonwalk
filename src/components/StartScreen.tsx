import React from 'react';
import { Play, Trophy, Settings, Zap, ArrowUp, ArrowDown, Sparkles, Route, User, Target, Crown, QrCode } from 'lucide-react';
import { DifficultyMode, GameSettings, UserAccount } from '../types';
import logoImg from '../assets/images/mj_cyber_logo_1786618882261.jpg';
import { DailyMissionsService } from '../services/dailyMissionsService';

interface StartScreenProps {
  onStart: () => void;
  difficulty: DifficultyMode;
  onChangeDifficulty: (diff: DifficultyMode) => void;
  onOpenLeaderboard: () => void;
  onOpenSettings: () => void;
  onOpenLevelRoad: () => void;
  onOpenProfile: () => void;
  onOpenDailyMissions: () => void;
  onOpenPremiumStore: () => void;
  onOpenEasypaisa?: () => void;
  currentUser: UserAccount | null;
  highScore: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStart,
  difficulty,
  onChangeDifficulty,
  onOpenLeaderboard,
  onOpenSettings,
  onOpenLevelRoad,
  onOpenProfile,
  onOpenDailyMissions,
  onOpenPremiumStore,
  onOpenEasypaisa,
  currentUser,
  highScore,
}) => {
  const unclaimedCount = DailyMissionsService.getUnclaimedCount();

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-between p-3 sm:p-5 bg-slate-950/90 backdrop-blur-md text-white select-none overflow-y-auto">
      {/* Top Bar: Settings & User Profile & Highscore */}
      <div className="w-full max-w-4xl flex justify-between items-center flex-wrap gap-1.5">
        <div className="flex items-center gap-1.5">
          <button
            id="start-user-profile-top-btn"
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-cyan-400/50 hover:border-cyan-300 text-cyan-300 text-[11px] font-bold transition shadow-[0_0_10px_rgba(0,243,255,0.25)] cursor-pointer"
          >
            <span className="text-sm">{currentUser ? currentUser.avatar : '👤'}</span>
            <span className="max-w-[100px] truncate">{currentUser ? currentUser.username : 'LOGIN'}</span>
            <span className="px-1 py-0.1 rounded bg-cyan-950 border border-cyan-400/50 text-[9px] text-cyan-300 font-mono">
              LVL {currentUser?.playerLevel || 1}
            </span>
          </button>

          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-cyan-500/30 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(0,243,255,0.2)]">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] text-gray-300 font-semibold uppercase tracking-wider hidden sm:inline">HIGH:</span>
            <span className="text-xs font-extrabold text-amber-300 font-mono">{highScore.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {onOpenEasypaisa && (
            <button
              id="start-easypaisa-top-btn"
              onClick={onOpenEasypaisa}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/80 text-emerald-300 hover:border-emerald-300 hover:bg-emerald-900/80 text-[11px] font-bold transition shadow-[0_0_10px_rgba(16,185,129,0.3)] cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>EASYPAISA</span>
            </button>
          )}

          <button
            id="start-premium-store-top-btn"
            onClick={onOpenPremiumStore}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-400/80 text-amber-300 hover:border-amber-300 hover:bg-amber-500/30 text-[11px] font-bold transition shadow-[0_0_10px_rgba(245,158,11,0.3)] cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
            <span>VIP VAULT</span>
          </button>

          <button
            id="start-daily-missions-top-btn"
            onClick={onOpenDailyMissions}
            className="relative flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 border border-fuchsia-500/50 text-fuchsia-300 hover:border-fuchsia-400 hover:bg-slate-800 text-[11px] font-bold transition shadow-md cursor-pointer"
          >
            <Target className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>MISSIONS</span>
            {unclaimedCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1 py-0.1 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black font-mono animate-bounce shadow-[0_0_8px_rgba(16,185,129,0.8)]">
                {unclaimedCount}
              </span>
            )}
          </button>

          <button
            id="start-level-road-top-btn"
            onClick={onOpenLevelRoad}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 border border-emerald-500/40 text-emerald-300 hover:border-emerald-400 hover:bg-slate-800 text-[11px] font-bold transition shadow-md cursor-pointer"
          >
            <Route className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">ROAD</span>
          </button>

          <button
            id="start-leaderboard-btn"
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 border border-fuchsia-500/40 text-fuchsia-300 hover:border-fuchsia-400 hover:bg-slate-800 text-[11px] font-bold transition shadow-md cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>RANK</span>
          </button>

          <button
            id="start-settings-btn"
            onClick={onOpenSettings}
            className="p-1.5 rounded-full bg-slate-900/80 border border-slate-700 text-gray-300 hover:text-cyan-300 hover:border-cyan-500 transition shadow-md cursor-pointer"
            title="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="flex flex-col items-center text-center my-auto py-2 max-w-lg">
        {/* Game Logo Emblem */}
        <div className="relative mb-2 group">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400 opacity-75 blur-sm animate-pulse" />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-cyan-400 shadow-[0_0_20px_rgba(0,243,255,0.4)] bg-slate-900">
            <img
              src={logoImg}
              alt="MJ Cyber Moonwalk Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold uppercase tracking-wider mb-1 shadow-[0_0_10px_rgba(0,243,255,0.25)]">
          <Sparkles className="w-3 h-3 text-cyan-300" />
          <span>CYBERPUNK RUNNER • 100 LEVELS • VERSION 1.0</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 drop-shadow-[0_0_20px_rgba(0,243,255,0.5)] font-sans">
          MJ CYBER MOONWALK
        </h1>
        <p className="mt-0.5 text-[11px] sm:text-xs text-cyan-200/90 font-medium tracking-wide">
          Glide through Neo-City 2099, collect power-up Orbs, and master the anti-gravity moonwalk!
        </p>

        {/* Difficulty Selection */}
        <div className="mt-3 w-full max-w-sm bg-slate-900/80 border border-slate-800 p-1 rounded-xl flex items-center gap-1 shadow-lg">
          <button
            id="diff-smooth-btn"
            onClick={() => onChangeDifficulty('smooth')}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              difficulty === 'smooth'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,243,255,0.5)] font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🎵 SMOOTH
          </button>

          <button
            id="diff-thriller-btn"
            onClick={() => onChangeDifficulty('thriller')}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              difficulty === 'thriller'
                ? 'bg-fuchsia-500 text-slate-950 shadow-[0_0_10px_rgba(255,0,255,0.5)] font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ⚡ THRILLER
          </button>

          <button
            id="diff-dangerous-btn"
            onClick={() => onChangeDifficulty('dangerous')}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              difficulty === 'dangerous'
                ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.5)] font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            💥 DANGEROUS
          </button>
        </div>

        {/* Primary Start Moonwalk Button (Compact & Sleek) */}
        <div className="mt-3 w-full max-w-sm">
          <button
            id="start-game-main-btn"
            onClick={onStart}
            className="w-full py-2.5 sm:py-3 px-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400 text-slate-950 font-black text-xs sm:text-sm tracking-widest uppercase shadow-[0_0_25px_rgba(0,243,255,0.6)] hover:shadow-[0_0_40px_rgba(255,0,255,0.8)] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <div className="p-1 bg-slate-950/20 rounded-full group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950" />
            </div>
            <span className="drop-shadow-sm font-sans">START MOONWALK</span>
          </button>
        </div>

        {/* Controls Guide Card */}
        <div className="mt-3 grid grid-cols-3 gap-2 w-full max-w-sm text-[10px]">
          <div className="bg-slate-900/70 border border-cyan-500/25 p-2 rounded-xl flex flex-col items-center shadow-md">
            <div className="p-1 bg-cyan-950 text-cyan-300 rounded-md mb-0.5">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-gray-200">SPACE / UP</span>
            <span className="text-[9px] text-gray-400">Jump / Glide</span>
          </div>

          <div className="bg-slate-900/70 border border-fuchsia-500/25 p-2 rounded-xl flex flex-col items-center shadow-md">
            <div className="p-1 bg-fuchsia-950 text-fuchsia-300 rounded-md mb-0.5">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-gray-200">DOWN / S</span>
            <span className="text-[9px] text-gray-400">Cyber Slide</span>
          </div>

          <div className="bg-slate-900/70 border border-emerald-500/25 p-2 rounded-xl flex flex-col items-center shadow-md">
            <div className="p-1 bg-emerald-950 text-emerald-300 rounded-md mb-0.5">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-gray-200">SHIFT / E</span>
            <span className="text-[9px] text-gray-400">Blast Wave</span>
          </div>
        </div>
      </div>

      {/* Footer Vibe Tag & License */}
      <div className="flex flex-col items-center gap-0.5 text-[9px] sm:text-[10px] text-gray-500 font-mono tracking-wider uppercase mt-1">
        <div>Web Audio API Sound Synth • HTML5 Canvas • Highscores</div>
        <div className="text-[9px] text-cyan-400/90 font-bold">
          Registered License & Creator Rights: sameer338faiz@gmail.com
        </div>
      </div>
    </div>
  );
};

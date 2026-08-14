import React, { useState } from 'react';
import { RotateCcw, Trophy, Save, Sparkles, Home, Route, Target, Crown, QrCode, Tv, Coins } from 'lucide-react';
import { GameStats, UserAccount } from '../types';
import { DailyMissionsService } from '../services/dailyMissionsService';

interface GameOverModalProps {
  stats: GameStats;
  onRestart: () => void;
  onGoHome: () => void;
  onSaveScore: (playerName: string) => void;
  onOpenLeaderboard: () => void;
  onOpenLevelRoad?: () => void;
  onOpenDailyMissions?: () => void;
  onOpenPremiumStore?: () => void;
  onOpenEasypaisa?: () => void;
  onWatchAdToDoubleCoins?: () => void;
  currentUser?: UserAccount | null;
  isHighScore: boolean;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  onRestart,
  onGoHome,
  onSaveScore,
  onOpenLeaderboard,
  onOpenLevelRoad,
  onOpenDailyMissions,
  onOpenPremiumStore,
  onOpenEasypaisa,
  onWatchAdToDoubleCoins,
  currentUser,
  isHighScore,
}) => {
  const [playerName, setPlayerName] = useState(currentUser?.username || 'Smooth_Criminal');
  const [isSaved, setIsSaved] = useState(false);
  const unclaimedMissions = DailyMissionsService.getUnclaimedCount();

  // Calculate Performance Grade
  const getGrade = (score: number) => {
    if (score >= 15000) return { grade: 'S+', color: 'text-amber-300 border-amber-300 shadow-amber-500/50' };
    if (score >= 10000) return { grade: 'A', color: 'text-fuchsia-400 border-fuchsia-400 shadow-fuchsia-500/50' };
    if (score >= 5000) return { grade: 'B', color: 'text-cyan-400 border-cyan-400 shadow-cyan-500/50' };
    return { grade: 'C', color: 'text-gray-400 border-gray-400' };
  };

  const { grade, color: gradeColor } = getGrade(stats.score);

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || isSaved) return;
    onSaveScore(playerName.trim());
    setIsSaved(true);
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md select-none overflow-y-auto">
      <div className="w-full max-w-sm bg-slate-900 border border-fuchsia-500/40 rounded-2xl p-4 sm:p-5 shadow-[0_0_35px_rgba(255,0,255,0.25)] text-white flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        {isHighScore ? (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-1 shadow-[0_0_10px_rgba(251,191,36,0.4)]">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>NEW RECORD!</span>
          </div>
        ) : (
          <span className="text-[10px] uppercase tracking-widest text-fuchsia-400 font-extrabold mb-0.5">RUN CONCLUDED</span>
        )}

        <h2 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300">
          GAME OVER
        </h2>

        {/* Grade Badge */}
        <div className="my-2.5 flex items-center justify-center gap-3">
          <div className="text-left">
            <div className="text-[10px] text-gray-400 font-mono">FINAL SCORE</div>
            <div className="text-3xl font-black font-mono text-cyan-300 drop-shadow-[0_0_10px_rgba(0,243,255,0.6)]">
              {stats.score.toLocaleString()}
            </div>
          </div>

          <div
            className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center text-xl font-black shadow-md ${gradeColor}`}
          >
            {grade}
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="w-full grid grid-cols-4 gap-1.5 my-1.5 text-xs bg-slate-950/60 border border-slate-800 p-2 rounded-xl">
          <div className="flex flex-col">
            <span className="text-gray-400 text-[9px]">LEVEL</span>
            <span className="font-bold font-mono text-emerald-400 text-xs">Lvl {stats.level}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-400 text-[9px]">DIST</span>
            <span className="font-bold font-mono text-white text-xs">{Math.round(stats.distance)}m</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-400 text-[9px]">ORBS</span>
            <span className="font-bold font-mono text-amber-300 text-xs">💎{stats.orbsCollected}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-400 text-[9px]">COMBO</span>
            <span className="font-bold font-mono text-fuchsia-400 text-xs">{stats.maxCombo}x</span>
          </div>
        </div>

        {/* Comprehensive Score System Breakdown */}
        <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2 my-1.5 flex flex-col gap-1 text-left text-[11px] font-mono">
          <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider border-b border-slate-800 pb-0.5 flex justify-between items-center">
            <span>SCORE BREAKDOWN</span>
            <span className="text-cyan-400">{stats.score.toLocaleString()} PTS</span>
          </div>

          <div className="flex justify-between items-center text-gray-300">
            <span>🏃 Distance:</span>
            <span className="text-cyan-300 font-bold">+{ (stats.distanceScore || Math.round(stats.distance * 10)).toLocaleString() }</span>
          </div>

          <div className="flex justify-between items-center text-gray-300">
            <span>💎 Orbs/Powerups:</span>
            <span className="text-amber-300 font-bold">+{ (stats.orbScore || (stats.orbsCollected * 100)).toLocaleString() }</span>
          </div>

          <div className="flex justify-between items-center text-gray-300">
            <span>⚡ Close Calls:</span>
            <span className="text-emerald-400 font-bold">+{ (stats.bonusScore || 0).toLocaleString() }</span>
          </div>

          <div className="flex justify-between items-center text-gray-300 pt-0.5 border-t border-slate-800/60">
            <span className="text-[10px] text-fuchsia-300">🔥 Multiplier:</span>
            <span className="text-fuchsia-400 font-bold text-[11px]">{stats.currentMultiplier || 1.0}x</span>
          </div>
        </div>

        {/* Daily Missions Claim Alert */}
        {unclaimedMissions > 0 && onOpenDailyMissions && (
          <button
            id="gameover-daily-missions-claim-btn"
            onClick={onOpenDailyMissions}
            className="w-full my-1 p-2 bg-gradient-to-r from-fuchsia-950 to-slate-900 border border-fuchsia-500/80 rounded-xl flex justify-between items-center text-[11px] font-mono font-bold text-fuchsia-300 hover:border-fuchsia-300 transition shadow-[0_0_10px_rgba(217,70,239,0.25)] cursor-pointer animate-pulse"
          >
            <div className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>🎯 MISSIONS TO CLAIM!</span>
            </div>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black">
              +{unclaimedMissions}
            </span>
          </button>
        )}

        {/* Rewarded Ad Double Coins Action */}
        {onWatchAdToDoubleCoins && (
          <button
            id="gameover-watch-ad-btn"
            onClick={onWatchAdToDoubleCoins}
            className="w-full my-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.4)] active:scale-95 transition cursor-pointer flex items-center justify-between animate-pulse"
          >
            <div className="flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 fill-slate-950" />
              <span>WATCH AD</span>
            </div>
            <div className="flex items-center gap-1 font-mono font-black text-slate-950 text-[11px]">
              <Coins className="w-3.5 h-3.5" />
              <span>2X COINS (+{Math.max(100, stats.orbsCollected * 10)})</span>
            </div>
          </button>
        )}

        {/* Save Highscore Form */}
        {!isSaved ? (
          <form onSubmit={handleSubmitScore} className="w-full my-1.5 flex gap-1.5">
            <input
              id="gameover-player-name-input"
              type="text"
              maxLength={16}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Player Name"
              className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-lg px-2.5 py-1.5 text-xs font-mono text-cyan-200 outline-none"
            />
            <button
              id="gameover-save-score-btn"
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 active:scale-95 text-white font-bold text-xs flex items-center gap-1 shadow-md transition cursor-pointer"
            >
              <Save className="w-3 h-3" />
              <span>SAVE</span>
            </button>
          </form>
        ) : (
          <div className="my-1.5 text-[11px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-lg">
            ✓ SAVED TO LEADERBOARD!
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex gap-1.5 mt-1.5">
          <button
            id="gameover-home-btn"
            onClick={onGoHome}
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition active:scale-95 flex items-center justify-center cursor-pointer"
            title="Main Menu / Home"
          >
            <Home className="w-4 h-4" />
          </button>

          <button
            id="gameover-play-again-btn"
            onClick={onRestart}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 font-black text-xs tracking-wider uppercase shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:shadow-[0_0_25px_rgba(255,0,255,0.6)] active:scale-95 transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 fill-slate-950" />
            <span>PLAY AGAIN</span>
          </button>

          {onOpenLevelRoad && (
            <button
              id="gameover-view-road-btn"
              onClick={onOpenLevelRoad}
              className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-emerald-400 text-emerald-300 transition active:scale-95 flex items-center justify-center cursor-pointer"
              title="Level Road Map"
            >
              <Route className="w-4 h-4" />
            </button>
          )}

          <button
            id="gameover-view-leaderboard-btn"
            onClick={onOpenLeaderboard}
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-amber-400 text-amber-300 transition active:scale-95 flex items-center justify-center cursor-pointer"
            title="Leaderboard"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {onOpenEasypaisa && (
            <button
              id="gameover-view-easypaisa-btn"
              onClick={onOpenEasypaisa}
              className="p-2.5 rounded-xl bg-slate-800 border border-emerald-500/60 hover:border-emerald-400 text-emerald-300 transition active:scale-95 flex items-center justify-center cursor-pointer shadow-[0_0_8px_rgba(16,185,129,0.3)]"
              title="Easypaisa QR Code"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
            </button>
          )}

          {onOpenPremiumStore && (
            <button
              id="gameover-view-premium-store-btn"
              onClick={onOpenPremiumStore}
              className="p-2.5 rounded-xl bg-slate-800 border border-amber-500/60 hover:border-amber-400 text-amber-300 transition active:scale-95 flex items-center justify-center cursor-pointer shadow-[0_0_8px_rgba(245,158,11,0.3)]"
              title="VIP Store"
            >
              <Crown className="w-4 h-4 fill-amber-400/30" />
            </button>
          )}
        </div>

        {/* Ownership Rights Tag */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[9px] text-gray-500 font-mono flex items-center justify-center gap-1">
          <span>Rights:</span>
          <span className="text-cyan-400 font-bold">sameer338faiz@gmail.com</span>
        </div>
      </div>
    </div>
  );
};

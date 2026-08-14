import React, { useState, useEffect } from 'react';
import { X, Target, Award, Sparkles, Clock, CheckCircle2, Zap, Trophy, ShieldCheck } from 'lucide-react';
import { DailyMission, UserAccount } from '../types';
import { DailyMissionsService } from '../services/dailyMissionsService';
import { AuthService } from '../services/authService';

interface DailyMissionsModalProps {
  currentUser: UserAccount | null;
  onClose: () => void;
  onUserChange: (user: UserAccount | null) => void;
}

export const DailyMissionsModal: React.FC<DailyMissionsModalProps> = ({
  currentUser,
  onClose,
  onUserChange,
}) => {
  const [missions, setMissions] = useState<DailyMission[]>(DailyMissionsService.getMissions());
  const [resetTimer, setResetTimer] = useState<string>(DailyMissionsService.getTimeUntilReset());
  const [claimMessage, setClaimMessage] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setResetTimer(DailyMissionsService.getTimeUntilReset());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleClaim = (missionId: string) => {
    const res = DailyMissionsService.claimReward(missionId, currentUser?.id || null);
    if (res.success) {
      setMissions(DailyMissionsService.getMissions());
      if (res.user) {
        onUserChange(res.user);
      }
      setClaimMessage(`🎉 +${res.xpGained} XP CLAIMED!`);
      setTimeout(() => setClaimMessage(null), 3000);
    }
  };

  const handleClaimAll = () => {
    let totalXp = 0;
    let lastUser = currentUser;

    missions.forEach((m) => {
      if (m.completed && !m.claimed) {
        const res = DailyMissionsService.claimReward(m.id, currentUser?.id || null);
        if (res.success) {
          totalXp += res.xpGained;
          if (res.user) lastUser = res.user;
        }
      }
    });

    if (totalXp > 0) {
      setMissions(DailyMissionsService.getMissions());
      if (lastUser) onUserChange(lastUser);
      setClaimMessage(`🚀 CLAIMED ALL (+${totalXp} XP)!`);
      setTimeout(() => setClaimMessage(null), 3000);
    }
  };

  const userLevel = currentUser?.playerLevel || 1;
  const userXp = currentUser?.xp || 0;
  const reqXp = AuthService.getXpNextLevel(userLevel);
  const xpPercentage = Math.min(100, Math.round((userXp / reqXp) * 100));

  const unclaimedCount = missions.filter((m) => m.completed && !m.claimed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl text-white flex flex-col gap-4 max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-fuchsia-950/80 rounded-2xl border border-fuchsia-500/50 text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.3)]">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-fuchsia-300 tracking-wider">DAILY MISSIONS</h2>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-mono">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>Resets in {resetTimer}</span>
              </div>
            </div>
          </div>

          <button
            id="daily-missions-close-btn"
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Level & XP Progress Banner */}
        <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentUser?.avatar || '👤'}</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{currentUser?.username || 'Guest Runner'}</span>
                  <span className="px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono">
                    LVL {userLevel}
                  </span>
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  {userXp} / {reqXp} XP to Level {userLevel + 1}
                </span>
              </div>
            </div>

            {unclaimedCount > 0 && (
              <button
                id="claim-all-missions-btn"
                onClick={handleClaimAll}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-1 cursor-pointer animate-pulse"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>CLAIM ALL ({unclaimedCount})</span>
              </button>
            )}
          </div>

          {/* XP Progress Bar */}
          <div className="w-full h-2 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(0,243,255,0.6)]"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>

        {/* Claim Alert Banner */}
        {claimMessage && (
          <div className="p-2.5 bg-emerald-950/90 border border-emerald-500/60 rounded-xl text-emerald-300 text-xs font-mono font-bold text-center animate-bounce shadow-lg">
            {claimMessage}
          </div>
        )}

        {/* Missions List */}
        <div className="flex flex-col gap-3">
          {missions.map((m) => {
            const progressPercent = Math.min(100, Math.round((m.current / m.target) * 100));

            return (
              <div
                key={m.id}
                className={`p-4 rounded-2xl border transition flex flex-col gap-2.5 ${
                  m.claimed
                    ? 'bg-slate-950/40 border-slate-800/80 opacity-70'
                    : m.completed
                    ? 'bg-slate-950/90 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                {/* Mission Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 bg-slate-900 border border-slate-800 rounded-xl">
                      {m.icon}
                    </span>
                    <div className="flex flex-col">
                      <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                        <span>{m.title}</span>
                        {m.claimed && (
                          <span className="text-[10px] text-emerald-400 font-mono font-normal">
                            [DONE ✓]
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-400">{m.description}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-fuchsia-950/80 border border-fuchsia-500/40 text-fuchsia-300 text-xs font-mono font-black flex items-center gap-1 shadow-sm shrink-0">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>+{m.rewardXp} XP</span>
                  </span>
                </div>

                {/* Progress Bar & Counter */}
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex justify-between text-[11px] font-mono text-gray-300 font-bold">
                    <span>PROGRESS</span>
                    <span className={m.completed ? 'text-emerald-400 font-bold' : 'text-cyan-300'}>
                      {m.current.toLocaleString()} / {m.target.toLocaleString()} {m.unit}
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        m.completed
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-300 shadow-[0_0_10px_rgba(16,185,129,0.8)]'
                          : 'bg-gradient-to-r from-cyan-400 to-fuchsia-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Claim Button */}
                <div className="pt-1 flex justify-end">
                  {m.claimed ? (
                    <button
                      disabled
                      className="px-4 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-gray-500 font-bold text-xs uppercase tracking-wider cursor-not-allowed flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>REWARD CLAIMED</span>
                    </button>
                  ) : m.completed ? (
                    <button
                      id={`claim-mission-${m.id}`}
                      onClick={() => handleClaim(m.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-[0_0_15px_rgba(16,185,129,0.5)] cursor-pointer flex items-center gap-1.5 animate-bounce"
                    >
                      <Award className="w-4 h-4" />
                      <span>CLAIM +{m.rewardXp} XP</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-gray-500 font-mono italic">
                      In progress during runs...
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

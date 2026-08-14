import React, { useState } from 'react';
import { X, Trophy, Trash2 } from 'lucide-react';
import { LeaderboardEntry, DifficultyMode } from '../types';

interface LeaderboardModalProps {
  entries: LeaderboardEntry[];
  onClose: () => void;
  onClear: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  entries,
  onClose,
  onClear,
}) => {
  const [filter, setFilter] = useState<'all' | DifficultyMode>('all');

  const filtered = entries.filter((e) => (filter === 'all' ? true : e.difficulty === filter));

  const getRankBadge = (rank: number) => {
    if (rank === 0) return '🥇';
    if (rank === 1) return '🥈';
    if (rank === 2) return '🥉';
    return `#${rank + 1}`;
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md select-none">
      <div className="w-full max-w-xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_40px_rgba(0,243,255,0.25)] text-white flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-black tracking-wider text-cyan-300">CYBER LEADERBOARD</h2>
          </div>

          <button
            id="leaderboard-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-1.5 text-xs bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['all', 'smooth', 'thriller', 'dangerous'] as const).map((diff) => (
              <button
                key={diff}
                id={`leaderboard-filter-${diff}-btn`}
                onClick={() => setFilter(diff)}
                className={`px-3 py-1 rounded-lg font-bold uppercase transition ${
                  filter === diff
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          <button
            id="leaderboard-clear-btn"
            onClick={() => {
              if (confirm('Clear local high score leaderboard?')) {
                onClear();
              }
            }}
            className="p-2 text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
            title="Clear High Scores"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>

        {/* Scores Table */}
        <div className="flex-1 overflow-y-auto pr-1 my-2 space-y-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500 font-mono">
              No runs recorded for this difficulty yet!
            </div>
          ) : (
            filtered.map((entry, idx) => (
              <div
                key={entry.id || idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/30 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 text-center text-base font-extrabold font-mono text-amber-300">
                    {getRankBadge(idx)}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-sm text-white tracking-wide">{entry.name}</span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {entry.date} • {entry.difficulty.toUpperCase()} {entry.level ? `• LVL ${entry.level}` : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div className="flex flex-col">
                    <span className="text-xs font-mono font-bold text-gray-300">{Math.round(entry.distance)}m</span>
                    <span className="text-[10px] text-amber-300">💎 {entry.orbsCollected}</span>
                  </div>
                  <span className="text-lg font-black font-mono text-cyan-300">{entry.score.toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Close button */}
        <button
          id="leaderboard-modal-close-btn"
          onClick={onClose}
          className="mt-3 py-3 w-full rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs tracking-wider transition"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};

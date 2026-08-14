import React from 'react';
import { ArrowUp, ArrowDown, Zap } from 'lucide-react';

interface TouchControlsProps {
  onJump: () => void;
  onSlide: () => void;
  onAbility: () => void;
  hasAbilityReady: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onJump,
  onSlide,
  onAbility,
  hasAbilityReady,
}) => {
  return (
    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end pointer-events-none select-none z-10 md:hidden">
      {/* Left Side: Duck / Slide Button */}
      <div className="pointer-events-auto">
        <button
          id="touch-slide-btn"
          onTouchStart={(e) => {
            e.preventDefault();
            onSlide();
          }}
          onClick={onSlide}
          className="w-13 h-13 rounded-xl bg-slate-900/80 border border-fuchsia-500/60 active:bg-fuchsia-600/40 text-fuchsia-300 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(255,0,255,0.3)] active:scale-95 transition"
        >
          <ArrowDown className="w-6 h-6" />
          <span className="text-[9px] font-bold tracking-wider">SLIDE</span>
        </button>
      </div>

      {/* Middle Optional Ability Button */}
      {hasAbilityReady && (
        <div className="pointer-events-auto">
          <button
            id="touch-ability-btn"
            onTouchStart={(e) => {
              e.preventDefault();
              onAbility();
            }}
            onClick={onAbility}
            className="w-13 h-13 rounded-full bg-emerald-900/90 border border-emerald-400 text-emerald-200 animate-pulse flex flex-col items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.5)] active:scale-95 transition"
          >
            <Zap className="w-5 h-5 fill-emerald-300" />
            <span className="text-[8px] font-extrabold tracking-wider">BLAST</span>
          </button>
        </div>
      )}

      {/* Right Side: Jump Button */}
      <div className="pointer-events-auto">
        <button
          id="touch-jump-btn"
          onTouchStart={(e) => {
            e.preventDefault();
            onJump();
          }}
          onClick={onJump}
          className="w-14 h-14 rounded-xl bg-slate-900/80 border border-cyan-400/80 active:bg-cyan-500/40 text-cyan-200 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.35)] active:scale-95 transition"
        >
          <ArrowUp className="w-7 h-7" />
          <span className="text-[9px] font-extrabold tracking-wider">JUMP</span>
        </button>
      </div>
    </div>
  );
};

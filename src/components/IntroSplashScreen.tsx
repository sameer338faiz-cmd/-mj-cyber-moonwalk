import React, { useEffect, useState } from 'react';
import logoImg from '../assets/images/mj_cyber_logo_1786618882261.jpg';
import { Sparkles, Zap } from 'lucide-react';

interface IntroSplashScreenProps {
  onComplete: () => void;
}

export const IntroSplashScreen: React.FC<IntroSplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 3 seconds total duration = 3000ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2; // fills to 100% in 50 ticks * 60ms = 3000ms
      });
    }, 60);

    const timer = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white select-none overflow-hidden">
      {/* Background Cyber Neon Ambient Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.25)_0%,rgba(15,23,42,0.95)_70%,rgba(2,6,23,1)_100%)] pointer-events-none" />

      {/* Cyber Grid Lines Effect */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#00f3ff_1px,transparent_1px),linear-gradient(to_bottom,#00f3ff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Center Logo Showcase */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4 max-w-md text-center">
        {/* Animated Glowing Logo Frame */}
        <div className="relative group">
          {/* Neon Ring Backdrop Glow */}
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400 opacity-80 blur-xl animate-pulse" />

          {/* Logo Container */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-2 border-cyan-400 shadow-[0_0_50px_rgba(0,243,255,0.6)] bg-slate-900 transition-transform duration-700 hover:scale-105">
            <img
              src={logoImg}
              alt="MJ Cyber Moonwalk Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Cyber Title */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span className="text-xs font-mono font-black tracking-widest text-cyan-400 uppercase">
              NEO-CITY 2099 • VERSION 1.0
            </span>
            <Zap className="w-4 h-4 text-fuchsia-400 animate-bounce" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-amber-300 drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
            MJ CYBER MOONWALK
          </h1>
          <p className="text-[11px] text-gray-400 font-mono tracking-widest">INITIALIZING CYBER ENGINE...</p>
        </div>

        {/* 3 Seconds Cyber Progress Loading Bar */}
        <div className="w-full max-w-xs flex flex-col gap-1.5 mt-2">
          <div className="flex justify-between items-center text-[10px] font-mono font-bold">
            <span className="text-cyan-400">SYSTEM BOOT</span>
            <span className="text-fuchsia-400">{Math.min(100, Math.round(progress))}%</span>
          </div>

          <div className="w-full h-2.5 bg-slate-900 border border-slate-700 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400 rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(0,243,255,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Skip button for quick access */}
        <button
          onClick={onComplete}
          className="mt-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700 hover:border-cyan-400 text-gray-400 hover:text-cyan-300 text-[10px] font-mono font-bold tracking-wider transition cursor-pointer"
        >
          SKIP INTRO [3s]
        </button>
      </div>
    </div>
  );
};

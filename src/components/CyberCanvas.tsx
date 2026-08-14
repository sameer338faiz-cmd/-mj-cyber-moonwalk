import React, { useEffect, useRef } from 'react';
import { GameEngine } from '../game/GameEngine';
import { BackgroundTheme, DifficultyMode, GameSettings, GameStats, UserAccount } from '../types';

interface CyberCanvasProps {
  engineRef: React.MutableRefObject<GameEngine | null>;
  settings: GameSettings;
  difficulty: DifficultyMode;
  currentUser: UserAccount | null;
  onGameOver: (stats: GameStats) => void;
  onStatsUpdate: (stats: GameStats) => void;
  onPauseToggle: () => void;
}

export const CyberCanvas: React.FC<CyberCanvasProps> = ({
  engineRef,
  settings,
  difficulty,
  currentUser,
  onGameOver,
  onStatsUpdate,
  onPauseToggle,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(canvasRef.current, settings, difficulty);
    engine.setCallbacks(onGameOver, onStatsUpdate);
    engineRef.current = engine;

    if (currentUser) {
      engine.equippedSkin = currentUser.activeSkin || 'default';
      engine.equippedTrail = currentUser.activeTrail || 'cyan';
      engine.equippedTheme = currentUser.activeTheme || 'cyber_night';
      engine.isVipPassActive = !!currentUser.isVipPassActive;
    }

    const handleResize = () => {
      engine.resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    // Keyboard Event Handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default page scroll for space and arrows
      if (['Space', 'ArrowUp', 'ArrowDown', 'KeyS', 'KeyE', 'ShiftLeft', 'ShiftRight'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        engine.triggerJump();
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        engine.triggerSlide();
      } else if (e.code === 'KeyE' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        engine.triggerAbility();
      } else if (e.code === 'Escape' || e.code === 'KeyP') {
        onPauseToggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      engine.stop();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Update Settings/Difficulty/Cosmetics when props change
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.settings = settings;
      engineRef.current.difficulty = difficulty;
      if (currentUser) {
        engineRef.current.equippedSkin = currentUser.activeSkin || 'default';
        engineRef.current.equippedTrail = currentUser.activeTrail || 'cyan';
        engineRef.current.equippedTheme = currentUser.activeTheme || 'cyber_night';
        engineRef.current.isVipPassActive = !!currentUser.isVipPassActive;
      }
    }
  }, [settings, difficulty, currentUser]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover block cursor-pointer"
        onClick={() => {
          if (engineRef.current?.isRunning && !engineRef.current.isPaused) {
            engineRef.current.triggerJump();
          }
        }}
      />
    </div>
  );
};

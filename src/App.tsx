import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Map, LogOut } from 'lucide-react';
import { GameState, DifficultyMode, GameSettings, GameStats, LeaderboardEntry, UserAccount } from './types';
import { StorageService } from './services/storageService';
import { AuthService } from './services/authService';
import { audioService } from './services/audioService';
import { GameEngine } from './game/GameEngine';
import { CyberCanvas } from './components/CyberCanvas';
import { HUD } from './components/HUD';
import { TouchControls } from './components/TouchControls';
import { StartScreen } from './components/StartScreen';
import { GameOverModal } from './components/GameOverModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { SettingsModal } from './components/SettingsModal';
import { LevelRoadModal } from './components/LevelRoadModal';
import { UserProfileModal } from './components/UserProfileModal';
import { DailyMissionsModal } from './components/DailyMissionsModal';
import { PremiumStoreModal } from './components/PremiumStoreModal';
import { EasypaisaModal } from './components/EasypaisaModal';
import { IntroSplashScreen } from './components/IntroSplashScreen';
import { RevenueHubModal } from './components/RevenueHubModal';
import { RewardedAdModal } from './components/RewardedAdModal';
import { AdBannerBar } from './components/AdBannerBar';
import { DailyMissionsService } from './services/dailyMissionsService';

export default function App() {
  const engineRef = useRef<GameEngine | null>(null);

  // Intro Splash State (3 seconds animation)
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // User Auth State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(AuthService.getActiveUser());

  // App State
  const [gameState, setGameState] = useState<GameState>('START');
  const [difficulty, setDifficulty] = useState<DifficultyMode>('thriller');
  const [settings, setSettings] = useState<GameSettings>(StorageService.getSettings());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(StorageService.getLeaderboard());

  // Modals - Login screen opens first on start
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showLevelRoad, setShowLevelRoad] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(true);
  const [showDailyMissions, setShowDailyMissions] = useState<boolean>(false);
  const [showPremiumStore, setShowPremiumStore] = useState<boolean>(false);
  const [showEasypaisaModal, setShowEasypaisaModal] = useState<boolean>(false);
  const [showRevenueHub, setShowRevenueHub] = useState<boolean>(false);
  const [showRewardedAd, setShowRewardedAd] = useState<boolean>(false);

  const handleGrantAdReward = () => {
    if (currentUser) {
      const bonusCoins = Math.max(500, stats.orbsCollected * 20);
      const updated = AuthService.addCyberCoins(currentUser.id, bonusCoins);
      if (updated) setCurrentUser(updated);
    }
  };

  // Live Stats
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    distance: 0,
    orbsCollected: 0,
    combo: 0,
    maxCombo: 0,
    speed: 7,
    speedMultiplier: 1,
    lives: 1,
    activePowerUp: null,
    hasShield: false,
  });

  // Calculate overall high score
  const highScore = leaderboard.length > 0 ? leaderboard[0].score : 0;
  const isHighScore = stats.score > 0 && stats.score >= highScore;

  // Sync settings with audio service on load
  useEffect(() => {
    audioService.updateSettings(settings);
  }, [settings]);

  // Start Game
  const handleStartGame = () => {
    setGameState('PLAYING');
    if (engineRef.current) {
      const bestScore = Math.max(
        currentUser?.highScore || 0,
        leaderboard[0]?.score || 0
      );
      engineRef.current.setPreviousHighScore(bestScore);
      engineRef.current.difficulty = difficulty;
      engineRef.current.settings = settings;
      engineRef.current.equippedSkin = currentUser?.activeSkin || 'default';
      engineRef.current.equippedTrail = currentUser?.activeTrail || 'cyan';
      engineRef.current.equippedTheme = currentUser?.activeTheme || 'cyber_night';
      engineRef.current.isVipPassActive = currentUser?.isVipPassActive || false;
      engineRef.current.start();
    }
    audioService.playClick();
  };

  // Quick Restart Game Immediately from Pause / Game State
  const handleQuickRestart = () => {
    audioService.playClick();
    if (engineRef.current) {
      engineRef.current.stop();
    }
    handleStartGame();
  };

  // Toggle Pause
  const handleTogglePause = () => {
    if (gameState === 'PLAYING') {
      setGameState('PAUSED');
      engineRef.current?.pause();
      audioService.stopMusic();
    } else if (gameState === 'PAUSED') {
      setGameState('PLAYING');
      engineRef.current?.resume();
      if (!settings.musicMuted) {
        audioService.startSynthwaveMusic();
      }
    }
  };

  // Toggle Audio Mute Quick
  const handleToggleMute = () => {
    const updated = {
      ...settings,
      sfxMuted: !settings.sfxMuted,
      musicMuted: !settings.musicMuted,
    };
    setSettings(updated);
    StorageService.saveSettings(updated);
  };

  // Save Score to Leaderboard
  const handleSaveScore = (playerName: string) => {
    const updatedLeaderboard = StorageService.addScore({
      name: playerName,
      score: stats.score,
      distance: Math.round(stats.distance),
      level: stats.level,
      orbsCollected: stats.orbsCollected,
      maxCombo: stats.maxCombo,
      difficulty,
    });
    setLeaderboard(updatedLeaderboard);

    // Also update logged in profile stats
    AuthService.recordGameStats(stats.score, stats.distance, stats.level, stats.orbsCollected);
    setCurrentUser(AuthService.getActiveUser());
  };

  // Clear Leaderboard
  const handleClearLeaderboard = () => {
    StorageService.clearLeaderboard();
    setLeaderboard([]);
  };

  // Game Over Callback
  const handleGameOver = (finalStats: GameStats) => {
    setStats(finalStats);
    setGameState('GAMEOVER');
    audioService.stopMusic();

    // Update Daily Mission Progress
    DailyMissionsService.updateProgress({
      distance: finalStats.distance,
      survivalTime: Math.round((finalStats.distance * 10) / (finalStats.speed || 10)),
      orbs: finalStats.orbsCollected,
      maxCombo: finalStats.maxCombo,
      score: finalStats.score,
      level: finalStats.level,
    });

    // Auto update user profile stats
    AuthService.recordGameStats(finalStats.score, finalStats.distance, finalStats.level, finalStats.orbsCollected);
    setCurrentUser(AuthService.getActiveUser());
  };

  // Stats Update Callback
  const handleStatsUpdate = (updatedStats: GameStats) => {
    setStats(updatedStats);
  };

  // Update Settings
  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* 3 Seconds Intro Splash Screen with Logo */}
      {showSplash && (
        <IntroSplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {/* HTML5 Canvas Engine */}
      <CyberCanvas
        engineRef={engineRef}
        settings={settings}
        difficulty={difficulty}
        currentUser={currentUser}
        onGameOver={handleGameOver}
        onStatsUpdate={handleStatsUpdate}
        onPauseToggle={handleTogglePause}
      />

      {/* Start Screen Overlay */}
      {gameState === 'START' && (
        <StartScreen
          onStart={handleStartGame}
          difficulty={difficulty}
          onChangeDifficulty={(diff) => {
            setDifficulty(diff);
            audioService.playClick();
          }}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenLevelRoad={() => setShowLevelRoad(true)}
          onOpenProfile={() => setShowProfile(true)}
          onOpenDailyMissions={() => setShowDailyMissions(true)}
          onOpenPremiumStore={() => setShowPremiumStore(true)}
          onOpenEasypaisa={() => setShowEasypaisaModal(true)}
          currentUser={currentUser}
          highScore={highScore}
        />
      )}

      {/* In-Game HUD Overlay */}
      {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
        <HUD
          stats={stats}
          isPaused={gameState === 'PAUSED'}
          onTogglePause={handleTogglePause}
          onToggleMute={handleToggleMute}
          isMuted={settings.sfxMuted && settings.musicMuted}
          onOpenSettings={() => setShowSettings(true)}
          onOpenLevelRoad={() => {
            if (gameState === 'PLAYING') {
              handleTogglePause();
            }
            setShowLevelRoad(true);
          }}
        />
      )}

      {/* Touch Control Overlay for Mobile/Tablet */}
      {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
        <TouchControls
          onJump={() => engineRef.current?.triggerJump()}
          onSlide={() => engineRef.current?.triggerSlide()}
          onAbility={() => engineRef.current?.triggerAbility()}
          hasAbilityReady={stats.activePowerUp?.type === 'blast'}
        />
      )}

      {/* Paused Screen Overlay */}
      {gameState === 'PAUSED' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl p-4 sm:p-6 text-center text-white shadow-[0_0_35px_rgba(0,243,255,0.2)] flex flex-col items-center gap-3 max-w-sm w-full">
            <div className="p-2 bg-cyan-500/10 border border-cyan-400/40 rounded-xl">
              <h2 className="text-xl sm:text-2xl font-black tracking-wider text-cyan-300">GAME PAUSED</h2>
            </div>
            <p className="text-[11px] text-gray-400 font-mono">Press P or Escape to resume</p>

            <div className="flex flex-col sm:flex-row gap-2 w-full justify-center mt-0.5">
              <button
                id="pause-resume-btn"
                onClick={handleTogglePause}
                className="flex-1 min-w-[100px] px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs tracking-wider uppercase transition shadow-md cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>RESUME</span>
              </button>

              <button
                id="pause-restart-btn"
                onClick={handleQuickRestart}
                className="flex-1 min-w-[100px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs tracking-wider uppercase transition shadow-[0_0_12px_rgba(245,158,11,0.4)] cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                title="Restart this run immediately"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESTART</span>
              </button>
            </div>

            <div className="flex gap-2 w-full justify-center">
              <button
                id="pause-road-btn"
                onClick={() => setShowLevelRoad(true)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs tracking-wider uppercase transition border border-emerald-500/40 cursor-pointer flex items-center justify-center gap-1"
              >
                <span>ROAD 🗺️</span>
              </button>
              <button
                id="pause-quit-btn"
                onClick={() => {
                  engineRef.current?.stop();
                  setGameState('START');
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold text-xs tracking-wider uppercase transition border border-slate-700 cursor-pointer flex items-center justify-center gap-1"
              >
                <span>MAIN MENU</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {gameState === 'GAMEOVER' && (
        <GameOverModal
          stats={stats}
          onRestart={handleStartGame}
          onGoHome={() => {
            engineRef.current?.stop();
            setGameState('START');
            audioService.playClick();
          }}
          onSaveScore={handleSaveScore}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          onOpenLevelRoad={() => setShowLevelRoad(true)}
          onOpenDailyMissions={() => setShowDailyMissions(true)}
          onOpenPremiumStore={() => setShowPremiumStore(true)}
          onOpenEasypaisa={() => setShowEasypaisaModal(true)}
          onWatchAdToDoubleCoins={() => setShowRewardedAd(true)}
          currentUser={currentUser}
          isHighScore={isHighScore}
        />
      )}

      {/* Ad Banner Bar on Start or Game Over screen */}
      {(gameState === 'START' || gameState === 'GAMEOVER') && (
        <div className="absolute bottom-2 left-0 right-0 z-40 px-2 pointer-events-auto">
          <AdBannerBar />
        </div>
      )}

      {/* Revenue & Monetization Hub Modal */}
      {showRevenueHub && (
        <RevenueHubModal
          onClose={() => setShowRevenueHub(false)}
        />
      )}

      {/* Rewarded Video Ad Modal */}
      {showRewardedAd && (
        <RewardedAdModal
          rewardType="double_coins"
          coinsToDouble={Math.max(500, stats.orbsCollected * 20)}
          onRewardGranted={handleGrantAdReward}
          onClose={() => setShowRewardedAd(false)}
        />
      )}

      {/* Premium Store & VIP Cyber Vault Modal */}
      {showPremiumStore && (
        <PremiumStoreModal
          currentUser={currentUser}
          onClose={() => setShowPremiumStore(false)}
          onUserChange={(updatedUser) => {
            setCurrentUser(updatedUser);
          }}
        />
      )}

      {/* Easypaisa QR Modal */}
      {showEasypaisaModal && (
        <EasypaisaModal
          onClose={() => setShowEasypaisaModal(false)}
        />
      )}

      {/* Daily Missions Modal */}
      {showDailyMissions && (
        <DailyMissionsModal
          currentUser={currentUser}
          onClose={() => setShowDailyMissions(false)}
          onUserChange={(updatedUser) => {
            setCurrentUser(updatedUser);
          }}
        />
      )}

      {/* User Profile Modal */}
      {showProfile && (
        <UserProfileModal
          currentUser={currentUser}
          onClose={() => setShowProfile(false)}
          onUserChange={(updatedUser) => {
            setCurrentUser(updatedUser);
          }}
          onOpenEasypaisa={() => setShowEasypaisaModal(true)}
        />
      )}

      {/* Level Road Map Modal */}
      {showLevelRoad && (
        <LevelRoadModal
          currentMaxLevel={Math.max(stats.level, StorageService.getMaxLevelReached())}
          onClose={() => setShowLevelRoad(false)}
          onStartGame={handleStartGame}
        />
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <LeaderboardModal
          entries={leaderboard}
          onClose={() => setShowLeaderboard(false)}
          onClear={handleClearLeaderboard}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setShowSettings(false)}
          onOpenRevenueHub={() => setShowRevenueHub(true)}
        />
      )}
    </div>
  );
}

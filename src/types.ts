export type DifficultyMode = 'smooth' | 'thriller' | 'dangerous';

export type BackgroundTheme = 'cyber_night' | 'royal_gold' | 'thriller_blood' | 'neon_galaxy' | 'matrix_void';

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  avatar: string; // Emoji avatar or icon tag
  title: string; // Title e.g. "Cyber Moonwalker"
  bio: string;
  highScore: number;
  levelReached: number;
  totalRuns: number;
  totalDistance: number;
  totalOrbs: number;
  xp: number;
  playerLevel: number;
  createdAt: string;
  // PREMIUM VIP & SUBSCRIPTION FEATURES
  isVipPassActive?: boolean;
  subscriptionTier?: 'free' | 'runner_monthly' | 'legend_annual' | 'cyber_king_lifetime';
  subscriptionExpiresAt?: string; // e.g. "2027-08-13" or "Lifetime"
  autoRenews?: boolean;
  cyberCoins?: number;
  activeSkin?: string;
  unlockedSkins?: string[];
  activeTrail?: string;
  unlockedTrails?: string[];
  activeTheme?: BackgroundTheme;
  unlockedThemes?: BackgroundTheme[];
  activeSoundtrack?: string;
}

export type MissionType =
  | 'collect_orbs'
  | 'distance'
  | 'survival_time'
  | 'max_combo'
  | 'score'
  | 'reach_level';

export interface DailyMission {
  id: string;
  type: MissionType;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  rewardXp: number;
  completed: boolean;
  claimed: boolean;
  icon: string;
}

export interface DailyMissionsData {
  date: string; // YYYY-MM-DD
  missions: DailyMission[];
}

export type AuthTab = 'login' | 'register' | 'profile';

export interface GameSettings {
  sfxVolume: number; // 0 to 1
  musicVolume: number; // 0 to 1
  sfxMuted: boolean;
  musicMuted: boolean;
  screenShake: boolean;
  highGlow: boolean; // Visual glow toggle
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  distance: number; // in meters
  level: number; // level reached (1-100)
  orbsCollected: number;
  maxCombo: number;
  difficulty: DifficultyMode;
  date: string;
}

export type PowerUpType = 'shield' | 'multiplier' | 'magnet' | 'gravity' | 'blast';

export interface PowerUp {
  type: PowerUpType;
  duration: number; // in milliseconds
  remainingTime: number; // in milliseconds
}

export interface GameStats {
  score: number;
  distance: number;
  level: number; // 1 to 100
  orbsCollected: number;
  combo: number;
  maxCombo: number;
  speed: number;
  speedMultiplier: number;
  lives: number;
  activePowerUp: PowerUp | null;
  hasShield: boolean;
  distanceScore?: number;
  orbScore?: number;
  bonusScore?: number;
  currentMultiplier?: number;
  highScoreBeaten?: boolean;
}

export type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';

export interface PlayerState {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  isGrounded: boolean;
  isJumping: boolean;
  isSliding: boolean;
  jumpCount: number;
  maxJumps: number;
  slideTimer: number;
  moonwalkTimer: number; // Visual aesthetic glide effect
  animFrame: number;
  animTimer: number;
}

export type ObstacleType = 'spike' | 'drone' | 'laser' | 'wall';

export interface Obstacle {
  id: string;
  type: ObstacleType;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  passed: boolean;
  color: string;
  pulseOffset: number;
}

export interface OrbItem {
  id: string;
  type: PowerUpType | 'gem';
  x: number;
  y: number;
  radius: number;
  baseY: number;
  floatOffset: number;
  collected: boolean;
  color: string;
  value: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'square' | 'star';
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  alpha: number;
  fontSize: number;
  vy: number;
}

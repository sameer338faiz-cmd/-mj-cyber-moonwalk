import { GameSettings, LeaderboardEntry } from '../types';

const LEADERBOARD_KEY = 'mj_cyber_runner_leaderboard';
const SETTINGS_KEY = 'mj_cyber_runner_settings';
const STATS_KEY = 'mj_cyber_runner_stats';

export const DEFAULT_SETTINGS: GameSettings = {
  sfxVolume: 0.8,
  musicVolume: 0.5,
  sfxMuted: false,
  musicMuted: false,
  screenShake: true,
  highGlow: true,
};

export interface LifetimeStats {
  totalRuns: number;
  totalDistance: number;
  totalOrbs: number;
  highScore: number;
}

export const StorageService = {
  getSettings(): GameSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: GameSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings to localStorage', e);
    }
  },

  getLeaderboard(): LeaderboardEntry[] {
    try {
      const stored = localStorage.getItem(LEADERBOARD_KEY);
      if (stored) {
        const list: LeaderboardEntry[] = JSON.parse(stored);
        return list.sort((a, b) => b.score - a.score);
      }
    } catch (e) {
      console.warn('Failed to load leaderboard from localStorage', e);
    }
    // Default initial mock high scores if empty for fun community vibe!
    const defaultEntries: LeaderboardEntry[] = [
      {
        id: '1',
        name: 'Neo_MJ_23',
        score: 18450,
        distance: 2450,
        level: 25,
        orbsCollected: 84,
        maxCombo: 18,
        difficulty: 'thriller',
        date: new Date().toLocaleDateString(),
      },
      {
        id: '2',
        name: 'Cyber_Smooth',
        score: 12300,
        distance: 1800,
        level: 18,
        orbsCollected: 52,
        maxCombo: 12,
        difficulty: 'thriller',
        date: new Date().toLocaleDateString(),
      },
      {
        id: '3',
        name: 'Moonwalk_Master',
        score: 8900,
        distance: 1250,
        level: 13,
        orbsCollected: 38,
        maxCombo: 9,
        difficulty: 'smooth',
        date: new Date().toLocaleDateString(),
      },
    ];
    this.saveLeaderboard(defaultEntries);
    return defaultEntries;
  },

  saveLeaderboard(entries: LeaderboardEntry[]): void {
    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
    } catch (e) {
      console.warn('Failed to save leaderboard to localStorage', e);
    }
  },

  addScore(entry: Omit<LeaderboardEntry, 'id' | 'date'>): LeaderboardEntry[] {
    const list = this.getLeaderboard();
    const newEntry: LeaderboardEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
    };
    const updated = [...list, newEntry].sort((a, b) => b.score - a.score).slice(0, 20); // Keep top 20
    this.saveLeaderboard(updated);
    this.updateLifetimeStats(entry.distance, entry.orbsCollected, entry.score);
    return updated;
  },

  getLifetimeStats(): LifetimeStats {
    try {
      const stored = localStorage.getItem(STATS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load lifetime stats from localStorage', e);
    }
    return {
      totalRuns: 0,
      totalDistance: 0,
      totalOrbs: 0,
      highScore: 0,
    };
  },

  updateLifetimeStats(distance: number, orbs: number, score: number): void {
    const current = this.getLifetimeStats();
    const updated: LifetimeStats = {
      totalRuns: current.totalRuns + 1,
      totalDistance: Math.round(current.totalDistance + distance),
      totalOrbs: current.totalOrbs + orbs,
      highScore: Math.max(current.highScore, score),
    };
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save lifetime stats to localStorage', e);
    }
  },

  getMaxLevelReached(): number {
    const leaderboard = this.getLeaderboard();
    const highestInLeaderboard = leaderboard.reduce((max, entry) => Math.max(max, entry.level || 1), 1);
    return Math.min(100, Math.max(1, highestInLeaderboard));
  },

  clearLeaderboard(): void {
    try {
      localStorage.removeItem(LEADERBOARD_KEY);
    } catch (e) {
      console.warn('Failed to clear leaderboard', e);
    }
  },
};

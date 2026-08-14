import { UserAccount } from '../types';
import { StorageService } from './storageService';

const USERS_KEY = 'mj_cyber_runner_users_db';
const ACTIVE_USER_KEY = 'mj_cyber_runner_active_user_id';

const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'user_default_1',
    username: 'Neo_MJ_23',
    email: 'neo@cyber.app',
    avatar: '🕺',
    title: 'Cyber Moonwalker',
    bio: 'Moonwalking through the cyber matrix at Level 100 speed!',
    highScore: 18450,
    levelReached: 25,
    totalRuns: 14,
    totalDistance: 12450,
    totalOrbs: 420,
    xp: 350,
    playerLevel: 4,
    createdAt: new Date().toLocaleDateString(),
    isVipPassActive: true,
    subscriptionTier: 'cyber_king_lifetime',
    subscriptionExpiresAt: 'Lifetime Unlimited',
    autoRenews: true,
    cyberCoins: 2500,
    activeSkin: 'gold_mj',
    unlockedSkins: ['default', 'gold_mj'],
    activeTrail: 'gold_sparkles',
    unlockedTrails: ['cyan', 'gold_sparkles'],
    activeSoundtrack: 'billie_jean_synth',
  },
  {
    id: 'user_default_2',
    username: 'Smooth_Criminal',
    email: 'smooth@mj.app',
    avatar: '🎩',
    title: 'Thriller Legend',
    bio: 'Dodging lasers and breaking high scores.',
    highScore: 12300,
    levelReached: 18,
    totalRuns: 9,
    totalDistance: 8200,
    totalOrbs: 210,
    xp: 150,
    playerLevel: 2,
    createdAt: new Date().toLocaleDateString(),
    isVipPassActive: false,
    cyberCoins: 800,
    activeSkin: 'smooth_criminal',
    unlockedSkins: ['default', 'smooth_criminal'],
    activeTrail: 'cyan',
    unlockedTrails: ['cyan'],
    activeSoundtrack: 'default',
  },
];

export const AuthService = {
  getUsers(): UserAccount[] {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load users from localStorage', e);
    }
    this.saveUsers(DEFAULT_USERS);
    return DEFAULT_USERS;
  },

  saveUsers(users: UserAccount[]): void {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to save users to localStorage', e);
    }
  },

  getActiveUser(): UserAccount | null {
    try {
      const activeId = localStorage.getItem(ACTIVE_USER_KEY);
      if (!activeId) return null;

      const users = this.getUsers();
      return users.find((u) => u.id === activeId) || null;
    } catch (e) {
      console.warn('Failed to get active user', e);
      return null;
    }
  },

  setActiveUser(userId: string | null): void {
    try {
      if (userId) {
        localStorage.setItem(ACTIVE_USER_KEY, userId);
      } else {
        localStorage.removeItem(ACTIVE_USER_KEY);
      }
    } catch (e) {
      console.warn('Failed to set active user', e);
    }
  },

  register(username: string, email: string, avatar = '🕺'): { success: boolean; message?: string; user?: UserAccount } {
    const users = this.getUsers();
    const existing = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() || u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (existing) {
      return { success: false, message: 'Username or email already exists!' };
    }

    const newUser: UserAccount = {
      id: 'user_' + Date.now(),
      username: username.trim(),
      email: email.trim(),
      avatar,
      title: 'Neon Rookie',
      bio: 'New runner on the 100 level cyber grid!',
      highScore: 0,
      levelReached: 1,
      totalRuns: 0,
      totalDistance: 0,
      totalOrbs: 0,
      xp: 0,
      playerLevel: 1,
      createdAt: new Date().toLocaleDateString(),
      isVipPassActive: false,
      cyberCoins: 500, // Gift 500 welcome coins
      activeSkin: 'default',
      unlockedSkins: ['default'],
      activeTrail: 'cyan',
      unlockedTrails: ['cyan'],
      activeSoundtrack: 'default',
    };

    const updated = [...users, newUser];
    this.saveUsers(updated);
    this.setActiveUser(newUser.id);
    return { success: true, user: newUser };
  },

  login(identifier: string): { success: boolean; message?: string; user?: UserAccount } {
    const users = this.getUsers();
    const term = identifier.trim().toLowerCase();
    const user = users.find((u) => u.username.toLowerCase() === term || u.email.toLowerCase() === term);

    if (!user) {
      return { success: false, message: 'Account not found. Please register!' };
    }

    this.setActiveUser(user.id);
    return { success: true, user };
  },

  logout(): void {
    this.setActiveUser(null);
  },

  updateProfile(userId: string, updates: Partial<UserAccount>): UserAccount | null {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) return null;

    users[index] = { ...users[index], ...updates };
    this.saveUsers(users);
    return users[index];
  },

  getXpNextLevel(level: number): number {
    return Math.max(100, (level || 1) * 500);
  },

  addXp(userId: string, amount: number): UserAccount | null {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) return null;

    const user = users[index];
    let newXp = (user.xp || 0) + amount;
    let newLevel = user.playerLevel || 1;
    let reqXp = this.getXpNextLevel(newLevel);

    while (newXp >= reqXp) {
      newXp -= reqXp;
      newLevel += 1;
      reqXp = this.getXpNextLevel(newLevel);
    }

    users[index] = {
      ...user,
      xp: newXp,
      playerLevel: newLevel,
    };

    this.saveUsers(users);
    return users[index];
  },

  recordGameStats(score: number, distance: number, level: number, orbs: number): void {
    const activeUser = this.getActiveUser();
    if (!activeUser) return;

    const isVip = activeUser.isVipPassActive;
    let earnedXp = Math.floor(score / 50) + Math.floor(distance / 20) + (orbs * 5) + (level * 20);
    let earnedCoins = (orbs * 10) + Math.floor(distance / 20);

    if (isVip) {
      earnedXp = Math.round(earnedXp * 2);
      earnedCoins = Math.round(earnedCoins * 2);
    }

    const updatedUser: UserAccount = {
      ...activeUser,
      highScore: Math.max(activeUser.highScore, score),
      levelReached: Math.max(activeUser.levelReached, level),
      totalRuns: activeUser.totalRuns + 1,
      totalDistance: Math.round(activeUser.totalDistance + distance),
      totalOrbs: activeUser.totalOrbs + orbs,
      cyberCoins: (activeUser.cyberCoins || 0) + earnedCoins,
    };

    this.updateProfile(activeUser.id, updatedUser);
    if (earnedXp > 0) {
      this.addXp(activeUser.id, earnedXp);
    }
  },

  activateVipPass(userId: string): UserAccount | null {
    return this.updateProfile(userId, {
      isVipPassActive: true,
      title: '👑 VIP Cyber King',
      cyberCoins: ((this.getActiveUser()?.cyberCoins || 0) + 1500),
      unlockedSkins: Array.from(new Set([...(this.getActiveUser()?.unlockedSkins || ['default']), 'gold_mj', 'smooth_criminal'])),
      unlockedTrails: Array.from(new Set([...(this.getActiveUser()?.unlockedTrails || ['cyan']), 'gold_sparkles', 'rainbow_laser'])),
    });
  },

  addCoins(userId: string, amount: number): UserAccount | null {
    const user = this.getActiveUser();
    if (!user) return null;
    return this.updateProfile(userId, {
      cyberCoins: (user.cyberCoins || 0) + amount,
    });
  },

  buyAndEquipSkin(userId: string, skinId: string, cost: number): { success: boolean; message?: string; user?: UserAccount } {
    const user = this.getActiveUser();
    if (!user) return { success: false, message: 'No active user found.' };

    const unlocked = user.unlockedSkins || ['default'];

    if (unlocked.includes(skinId)) {
      // Already unlocked, just equip
      const updated = this.updateProfile(userId, { activeSkin: skinId });
      return { success: true, user: updated || user };
    }

    const coins = user.cyberCoins || 0;
    if (coins < cost) {
      return { success: false, message: `Need ${cost - coins} more Cyber Coins!` };
    }

    const updated = this.updateProfile(userId, {
      cyberCoins: coins - cost,
      unlockedSkins: [...unlocked, skinId],
      activeSkin: skinId,
    });

    return { success: true, user: updated || user };
  },

  buyAndEquipTrail(userId: string, trailId: string, cost: number): { success: boolean; message?: string; user?: UserAccount } {
    const user = this.getActiveUser();
    if (!user) return { success: false, message: 'No active user found.' };

    const unlocked = user.unlockedTrails || ['cyan'];

    if (unlocked.includes(trailId)) {
      const updated = this.updateProfile(userId, { activeTrail: trailId });
      return { success: true, user: updated || user };
    }

    const coins = user.cyberCoins || 0;
    if (coins < cost) {
      return { success: false, message: `Need ${cost - coins} more Cyber Coins!` };
    }

    const updated = this.updateProfile(userId, {
      cyberCoins: coins - cost,
      unlockedTrails: [...unlocked, trailId],
      activeTrail: trailId,
    });

    return { success: true, user: updated || user };
  },

  buyAndEquipTheme(
    userId: string,
    themeId: 'cyber_night' | 'royal_gold' | 'thriller_blood' | 'neon_galaxy' | 'matrix_void',
    cost: number
  ): { success: boolean; message?: string; user?: UserAccount } {
    const user = this.getActiveUser();
    if (!user) return { success: false, message: 'No active user found.' };

    const unlocked = user.unlockedThemes || ['cyber_night'];

    if (unlocked.includes(themeId)) {
      const updated = this.updateProfile(userId, { activeTheme: themeId });
      return { success: true, user: updated || user };
    }

    const coins = user.cyberCoins || 0;
    if (coins < cost) {
      return { success: false, message: `Need ${cost - coins} more Cyber Coins!` };
    }

    const updated = this.updateProfile(userId, {
      cyberCoins: coins - cost,
      unlockedThemes: [...unlocked, themeId],
      activeTheme: themeId,
    });

    return { success: true, user: updated || user };
  },

  equipSoundtrack(userId: string, soundtrackId: string): UserAccount | null {
    return this.updateProfile(userId, { activeSoundtrack: soundtrackId });
  },

  subscribeTier(userId: string, tier: 'runner_monthly' | 'legend_annual' | 'cyber_king_lifetime'): UserAccount | null {
    const user = this.getActiveUser();
    if (!user) return null;

    let title = user.title;
    let coinsToAdd = 0;
    let expiry = '';

    if (tier === 'runner_monthly') {
      title = '⚡ Cyber Runner Pro';
      coinsToAdd = 1000;
      expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();
    } else if (tier === 'legend_annual') {
      title = '🌟 Cyber Legend VIP';
      coinsToAdd = 3500;
      expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString();
    } else if (tier === 'cyber_king_lifetime') {
      title = '👑 VIP Cyber King';
      coinsToAdd = 10000;
      expiry = 'Lifetime Unlimited';
    }

    const newUnlockedSkins = Array.from(
      new Set([...(user.unlockedSkins || ['default']), 'gold_mj', 'smooth_criminal', 'mecha_mj', 'thriller_cyborg'])
    );
    const newUnlockedTrails = Array.from(
      new Set([...(user.unlockedTrails || ['cyan']), 'gold_sparkles', 'rainbow_laser', 'matrix_code'])
    );
    const newUnlockedThemes = Array.from(
      new Set([
        ...(user.unlockedThemes || ['cyber_night']),
        'royal_gold' as const,
        'thriller_blood' as const,
        'neon_galaxy' as const,
        'matrix_void' as const,
      ])
    );

    return this.updateProfile(userId, {
      isVipPassActive: true,
      subscriptionTier: tier,
      subscriptionExpiresAt: expiry,
      autoRenews: tier !== 'cyber_king_lifetime',
      title,
      cyberCoins: (user.cyberCoins || 0) + coinsToAdd,
      unlockedSkins: newUnlockedSkins,
      unlockedTrails: newUnlockedTrails,
      unlockedThemes: newUnlockedThemes,
    });
  },

  cancelSubscription(userId: string): UserAccount | null {
    const user = this.getActiveUser();
    if (!user) return null;

    return this.updateProfile(userId, {
      autoRenews: false,
    });
  },

  addCyberCoins(userId: string, coinsToAdd: number): UserAccount | null {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId) || this.getActiveUser();
    if (!user) return null;

    const currentCoins = user.cyberCoins || 0;
    return this.updateProfile(user.id, {
      cyberCoins: currentCoins + coinsToAdd,
    });
  },
};

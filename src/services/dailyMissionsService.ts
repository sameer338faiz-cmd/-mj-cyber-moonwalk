import { DailyMission, DailyMissionsData, MissionType } from '../types';
import { AuthService } from './authService';

const MISSIONS_KEY = 'mj_cyber_daily_missions_db';

const MISSION_POOL: Omit<DailyMission, 'id' | 'current' | 'completed' | 'claimed'>[] = [
  {
    type: 'collect_orbs',
    title: 'Orb Collector',
    description: 'Collect 50 power-up orbs or gems',
    target: 50,
    unit: 'orbs',
    rewardXp: 300,
    icon: '💎',
  },
  {
    type: 'survival_time',
    title: 'Cyber Survivor',
    description: 'Survive for 2 minutes (120 seconds) in a single run',
    target: 120,
    unit: 'seconds',
    rewardXp: 350,
    icon: '⏱️',
  },
  {
    type: 'distance',
    title: 'Distance Walker',
    description: 'Moonwalk a total distance of 1,500 meters',
    target: 1500,
    unit: 'meters',
    rewardXp: 300,
    icon: '🏃',
  },
  {
    type: 'max_combo',
    title: 'Combo Master',
    description: 'Achieve a 10x combo multiplier streak',
    target: 10,
    unit: 'x combo',
    rewardXp: 250,
    icon: '⚡',
  },
  {
    type: 'score',
    title: 'High Scorer',
    description: 'Score 5,000 points in a single run',
    target: 5000,
    unit: 'pts',
    rewardXp: 300,
    icon: '🏆',
  },
  {
    type: 'reach_level',
    title: 'Level Climber',
    description: 'Reach Level 5 speed intensity in a run',
    target: 5,
    unit: 'lvl',
    rewardXp: 350,
    icon: '🚀',
  },
  {
    type: 'collect_orbs',
    title: 'Gem Hunter',
    description: 'Collect 25 gems or power-ups in cyber city',
    target: 25,
    unit: 'orbs',
    rewardXp: 200,
    icon: '✨',
  },
  {
    type: 'distance',
    title: 'Neon Dash',
    description: 'Glide across 800 meters in Neo-City',
    target: 800,
    unit: 'meters',
    rewardXp: 200,
    icon: '🌆',
  },
];

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Simple hash from string date to pick 3 distinct missions
function getDeterministicIndexes(dateStr: string, poolSize: number): number[] {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  hash = Math.abs(hash);

  const selected: number[] = [];
  let currentHash = hash;
  while (selected.length < 3 && selected.length < poolSize) {
    const idx = currentHash % poolSize;
    if (!selected.includes(idx)) {
      selected.push(idx);
    }
    currentHash = Math.floor(currentHash / 7) + 13 * (selected.length + 1);
  }
  return selected;
}

export const DailyMissionsService = {
  getDailyData(): DailyMissionsData {
    const today = getTodayString();
    try {
      const stored = localStorage.getItem(MISSIONS_KEY);
      if (stored) {
        const parsed: DailyMissionsData = JSON.parse(stored);
        if (parsed.date === today && parsed.missions && parsed.missions.length === 3) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse daily missions from localStorage', e);
    }

    // Generate new missions for today
    const indexes = getDeterministicIndexes(today, MISSION_POOL.length);
    const missions: DailyMission[] = indexes.map((idx, i) => {
      const template = MISSION_POOL[idx];
      return {
        ...template,
        id: `mission_${today}_${i + 1}`,
        current: 0,
        completed: false,
        claimed: false,
      };
    });

    const newDailyData: DailyMissionsData = {
      date: today,
      missions,
    };

    this.saveDailyData(newDailyData);
    return newDailyData;
  },

  saveDailyData(data: DailyMissionsData): void {
    try {
      localStorage.setItem(MISSIONS_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save daily missions to localStorage', e);
    }
  },

  getMissions(): DailyMission[] {
    return this.getDailyData().missions;
  },

  updateProgress(runData: {
    distance?: number;
    survivalTime?: number; // in seconds
    orbs?: number;
    maxCombo?: number;
    score?: number;
    level?: number;
  }): { updated: boolean; newlyCompleted: DailyMission[] } {
    const dailyData = this.getDailyData();
    let updated = false;
    const newlyCompleted: DailyMission[] = [];

    const updatedMissions = dailyData.missions.map((m) => {
      if (m.completed) return m;

      let newCurrent = m.current;

      switch (m.type) {
        case 'collect_orbs':
          if (runData.orbs) {
            newCurrent += runData.orbs;
          }
          break;
        case 'distance':
          if (runData.distance) {
            newCurrent += Math.round(runData.distance);
          }
          break;
        case 'survival_time':
          if (runData.survivalTime) {
            newCurrent = Math.max(newCurrent, Math.round(runData.survivalTime));
          }
          break;
        case 'max_combo':
          if (runData.maxCombo) {
            newCurrent = Math.max(newCurrent, runData.maxCombo);
          }
          break;
        case 'score':
          if (runData.score) {
            newCurrent = Math.max(newCurrent, runData.score);
          }
          break;
        case 'reach_level':
          if (runData.level) {
            newCurrent = Math.max(newCurrent, runData.level);
          }
          break;
      }

      newCurrent = Math.min(newCurrent, m.target);
      const isNowCompleted = newCurrent >= m.target;

      if (newCurrent !== m.current || isNowCompleted !== m.completed) {
        updated = true;
        if (isNowCompleted && !m.completed) {
          const completedMission = { ...m, current: newCurrent, completed: true };
          newlyCompleted.push(completedMission);
          return completedMission;
        }
        return { ...m, current: newCurrent, completed: isNowCompleted };
      }

      return m;
    });

    if (updated) {
      this.saveDailyData({
        ...dailyData,
        missions: updatedMissions,
      });
    }

    return { updated, newlyCompleted };
  },

  claimReward(missionId: string, userId: string | null): { success: boolean; xpGained: number; user: any } {
    const dailyData = this.getDailyData();
    const missionIndex = dailyData.missions.findIndex((m) => m.id === missionId);

    if (missionIndex === -1) {
      return { success: false, xpGained: 0, user: null };
    }

    const mission = dailyData.missions[missionIndex];
    if (!mission.completed || mission.claimed) {
      return { success: false, xpGained: 0, user: null };
    }

    dailyData.missions[missionIndex].claimed = true;
    this.saveDailyData(dailyData);

    let updatedUser = null;
    if (userId) {
      updatedUser = AuthService.addXp(userId, mission.rewardXp);
    }

    return { success: true, xpGained: mission.rewardXp, user: updatedUser };
  },

  getUnclaimedCount(): number {
    const missions = this.getMissions();
    return missions.filter((m) => m.completed && !m.claimed).length;
  },

  getTimeUntilReset(): string {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const diffMs = tomorrow.getTime() - now.getTime();

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  },
};

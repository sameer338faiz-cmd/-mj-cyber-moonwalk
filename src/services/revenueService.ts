export interface TrxPayment {
  id: string;
  userId: string;
  username: string;
  userEmail: string;
  packageTitle: string; // e.g. "50,000 Cyber Coins" or "Annual VIP Pass"
  amountPkr: number;
  amountUsd: number;
  trxId: string;
  paymentMethod: 'Easypaisa' | 'JazzCash' | 'Bank Transfer' | 'Credit Card';
  screenshotUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  rewardType: 'coins' | 'vip_monthly' | 'vip_annual' | 'vip_lifetime';
  rewardValue: number; // e.g. 50000 coins
}

export interface AdImpressionLog {
  id: string;
  type: 'banner' | 'rewarded_video' | 'interstitial';
  sponsorName: string;
  estRevenueUsd: number;
  timestamp: string;
}

export interface RevenueSettings {
  easypaisaNumber: string;
  easypaisaTitle: string;
  jazzcashNumber: string;
  adsensePublisherId: string;
  adsenseBannerUnitId: string;
  enableRewardedAds: boolean;
  enableBannerAds: boolean;
  coinRatePkrPer1k: number; // e.g., 50 PKR per 1k coins
  totalAdImpressions: number;
  totalEstAdRevenueUsd: number;
}

const TRX_STORAGE_KEY = 'mj_cyber_trx_payments';
const REV_SETTINGS_KEY = 'mj_cyber_revenue_settings';
const AD_LOGS_KEY = 'mj_cyber_ad_logs';

const DEFAULT_SETTINGS: RevenueSettings = {
  easypaisaNumber: '0300 1234567',
  easypaisaTitle: 'Sameer Faiz',
  jazzcashNumber: '0300 1234567',
  adsensePublisherId: 'ca-pub-1234567890123456',
  adsenseBannerUnitId: '9876543210',
  enableRewardedAds: true,
  enableBannerAds: true,
  coinRatePkrPer1k: 50,
  totalAdImpressions: 42,
  totalEstAdRevenueUsd: 18.50,
};

const DEFAULT_TRX_PAYMENTS: TrxPayment[] = [
  {
    id: 'trx-101',
    userId: 'user-001',
    username: 'Sameer Faiz',
    userEmail: 'sameer338faiz@gmail.com',
    packageTitle: '👑 VIP Cyber King (Lifetime)',
    amountPkr: 14000,
    amountUsd: 49.99,
    trxId: 'EP-9842710492',
    paymentMethod: 'Easypaisa',
    status: 'approved',
    createdAt: new Date(Date.now() - 3600000 * 24).toLocaleString(),
    rewardType: 'vip_lifetime',
    rewardValue: 1,
  },
  {
    id: 'trx-102',
    userId: 'user-002',
    username: 'CyberRunner99',
    userEmail: 'runner99@cyber.io',
    packageTitle: '⚡ 50,000 Cyber Coins Pack',
    amountPkr: 2500,
    amountUsd: 9.99,
    trxId: 'EP-8821940128',
    paymentMethod: 'Easypaisa',
    status: 'pending',
    createdAt: new Date().toLocaleString(),
    rewardType: 'coins',
    rewardValue: 50000,
  },
];

export const RevenueService = {
  getSettings(): RevenueSettings {
    try {
      const data = localStorage.getItem(REV_SETTINGS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error loading revenue settings', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: RevenueSettings): RevenueSettings {
    try {
      localStorage.setItem(REV_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving revenue settings', e);
    }
    return settings;
  },

  getTrxPayments(): TrxPayment[] {
    try {
      const data = localStorage.getItem(TRX_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error loading TRX payments', e);
    }
    return DEFAULT_TRX_PAYMENTS;
  },

  submitTrxPayment(payment: Omit<TrxPayment, 'id' | 'status' | 'createdAt'>): TrxPayment {
    const payments = this.getTrxPayments();
    const newTrx: TrxPayment = {
      ...payment,
      id: `trx-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toLocaleString(),
    };
    payments.unshift(newTrx);
    try {
      localStorage.setItem(TRX_STORAGE_KEY, JSON.stringify(payments));
    } catch (e) {
      console.error('Error saving TRX payment', e);
    }
    return newTrx;
  },

  approveTrxPayment(trxId: string): TrxPayment | null {
    const payments = this.getTrxPayments();
    const index = payments.findIndex((p) => p.id === trxId);
    if (index !== -1) {
      payments[index].status = 'approved';
      try {
        localStorage.setItem(TRX_STORAGE_KEY, JSON.stringify(payments));
      } catch (e) {
        console.error('Error approving TRX', e);
      }
      return payments[index];
    }
    return null;
  },

  rejectTrxPayment(trxId: string): TrxPayment | null {
    const payments = this.getTrxPayments();
    const index = payments.findIndex((p) => p.id === trxId);
    if (index !== -1) {
      payments[index].status = 'rejected';
      try {
        localStorage.setItem(TRX_STORAGE_KEY, JSON.stringify(payments));
      } catch (e) {
        console.error('Error rejecting TRX', e);
      }
      return payments[index];
    }
    return null;
  },

  recordAdImpression(type: 'banner' | 'rewarded_video' | 'interstitial', sponsorName: string, estCpmUsd: number = 0.15) {
    const settings = this.getSettings();
    settings.totalAdImpressions += 1;
    settings.totalEstAdRevenueUsd += estCpmUsd;
    this.saveSettings(settings);

    try {
      const logsStr = localStorage.getItem(AD_LOGS_KEY);
      const logs: AdImpressionLog[] = logsStr ? JSON.parse(logsStr) : [];
      logs.unshift({
        id: `ad-${Date.now()}`,
        type,
        sponsorName,
        estRevenueUsd: estCpmUsd,
        timestamp: new Date().toLocaleTimeString(),
      });
      localStorage.setItem(AD_LOGS_KEY, JSON.stringify(logs.slice(0, 50)));
    } catch (e) {
      console.error('Error logging ad impression', e);
    }
  },

  getAdLogs(): AdImpressionLog[] {
    try {
      const logsStr = localStorage.getItem(AD_LOGS_KEY);
      return logsStr ? JSON.parse(logsStr) : [];
    } catch (e) {
      return [];
    }
  }
};

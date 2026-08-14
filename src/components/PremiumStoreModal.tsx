import React, { useState } from 'react';
import {
  X,
  Crown,
  Sparkles,
  Zap,
  Shield,
  Coins,
  Check,
  CheckCircle2,
  Lock,
  Music,
  Flame,
  Star,
  Award,
  CreditCard,
  Calendar,
  RefreshCw,
  CheckCircle,
  QrCode,
  Smartphone,
  Copy,
  Upload,
  Edit3,
} from 'lucide-react';
import { UserAccount } from '../types';
import { AuthService } from '../services/authService';
import { EasypaisaService } from '../services/easypaisaService';
import { RevenueService } from '../services/revenueService';

interface PremiumStoreModalProps {
  currentUser: UserAccount | null;
  onClose: () => void;
  onUserChange: (user: UserAccount | null) => void;
}

export type StoreTab = 'subscriptions' | 'easypaisa' | 'themes' | 'skins' | 'trails' | 'tracks' | 'coins';

interface ThemeItem {
  id: 'cyber_night' | 'royal_gold' | 'thriller_blood' | 'neon_galaxy' | 'matrix_void';
  name: string;
  subtitle: string;
  cost: number;
  icon: string;
  previewGradient: string;
  borderColor: string;
  accentColor: string;
  features: string[];
  vipFree?: boolean;
}

const THEMES: ThemeItem[] = [
  {
    id: 'cyber_night',
    name: 'Neo-City Cyber Night',
    subtitle: 'Classic Neon Synthwave & Moonlit Towers',
    cost: 0,
    icon: '🌆',
    previewGradient: 'from-fuchsia-950 via-purple-950 to-slate-950',
    borderColor: 'border-cyan-500/50',
    accentColor: '#00f3ff',
    features: ['Neon Purple Cyber Moon', 'Glowing Hologram Signs', 'Cyan Speed Grid'],
    vipFree: true,
  },
  {
    id: 'royal_gold',
    name: '24K Royal Gold Kingdom',
    subtitle: 'Golden Moon & 24K Amber Skyline',
    cost: 1500,
    icon: '👑',
    previewGradient: 'from-amber-950 via-yellow-950 to-slate-950',
    borderColor: 'border-amber-400/80',
    accentColor: '#ffd700',
    features: ['24K Molten Gold Cyber Moon', 'Amber Skyscraper Windows', 'Golden Horizon & Grid'],
    vipFree: true,
  },
  {
    id: 'thriller_blood',
    name: 'Thriller Crimson Blood Moon',
    subtitle: 'Dark Gothic Horror & Blood-Red Skyline',
    cost: 1800,
    icon: '🩸',
    previewGradient: 'from-rose-950 via-red-950 to-slate-950',
    borderColor: 'border-rose-500/80',
    accentColor: '#ff0033',
    features: ['Glowing Crimson Blood Moon', 'Dark Gothic Skyline', 'Crimson Speed Gridlines'],
    vipFree: true,
  },
  {
    id: 'neon_galaxy',
    name: 'Cosmic Neon Galaxy',
    subtitle: 'Deep Violet Space & Twinkling Starfield',
    cost: 2000,
    icon: '🌌',
    previewGradient: 'from-indigo-950 via-purple-950 to-slate-950',
    borderColor: 'border-indigo-400/80',
    accentColor: '#a800ff',
    features: ['Animated Twinkling Starfield', 'Cosmic Violet Moon', 'Prism Neon Space Grid'],
    vipFree: true,
  },
  {
    id: 'matrix_void',
    name: 'Digital Matrix Void Rain',
    subtitle: 'Animated Green Binary Code Rain',
    cost: 2200,
    icon: '⚡',
    previewGradient: 'from-emerald-950 via-green-950 to-slate-950',
    borderColor: 'border-emerald-500/80',
    accentColor: '#00ff66',
    features: ['Real-time Matrix Binary Rain', 'Emerald Glowing Skyline', 'Digital Cyber Grid'],
    vipFree: true,
  },
];

interface SkinItem {
  id: string;
  name: string;
  subtitle: string;
  cost: number;
  previewBg: string;
  borderColor: string;
  accentColor: string;
  icon: string;
  vipFree?: boolean;
}

const SKINS: SkinItem[] = [
  {
    id: 'default',
    name: 'Original Cyber Suit',
    subtitle: 'Classic Neo-City 2099 Neon Runner',
    cost: 0,
    previewBg: 'from-cyan-950 to-slate-950',
    borderColor: 'border-cyan-500/50',
    accentColor: '#00f3ff',
    icon: '🕺',
  },
  {
    id: 'gold_mj',
    name: '24K Gold Hologram',
    subtitle: 'Golden metallic suit with glowing aura',
    cost: 1000,
    previewBg: 'from-amber-950 to-slate-950',
    borderColor: 'border-amber-400/80',
    accentColor: '#ffd700',
    icon: '👑',
    vipFree: true,
  },
  {
    id: 'smooth_criminal',
    name: 'Smooth Criminal 2099',
    subtitle: 'Iconic white fedora & glowing cyan tie',
    cost: 1200,
    previewBg: 'from-cyan-900 via-slate-900 to-slate-950',
    borderColor: 'border-cyan-300',
    accentColor: '#ffffff',
    icon: '🎩',
    vipFree: true,
  },
  {
    id: 'mecha_mj',
    name: 'Moonwalker Mecha',
    subtitle: 'Titanium cyber armor & chest arc-reactor',
    cost: 1800,
    previewBg: 'from-fuchsia-950 to-slate-950',
    borderColor: 'border-fuchsia-500/80',
    accentColor: '#f43f5e',
    icon: '🤖',
  },
  {
    id: 'thriller_cyborg',
    name: 'Thriller Cyborg',
    subtitle: 'Dark leather & crimson cybernetic eye visor',
    cost: 2000,
    previewBg: 'from-red-950 to-slate-950',
    borderColor: 'border-red-500/80',
    accentColor: '#ef4444',
    icon: '🧟',
  },
];

interface TrailItem {
  id: string;
  name: string;
  subtitle: string;
  cost: number;
  icon: string;
  color: string;
}

const TRAILS: TrailItem[] = [
  {
    id: 'cyan',
    name: 'Cyan Pulse Trail',
    subtitle: 'Standard high-frequency cyan particle stream',
    cost: 0,
    icon: '✨',
    color: '#00f3ff',
  },
  {
    id: 'gold_sparkles',
    name: 'Golden Starburst',
    subtitle: 'Emitters of sparkling 24K gold stars',
    cost: 600,
    icon: '⭐',
    color: '#ffd700',
  },
  {
    id: 'rainbow_laser',
    name: 'Rainbow Matrix',
    subtitle: 'Multi-color prism laser moonwalk streak',
    cost: 800,
    icon: '🌈',
    color: '#ff00ff',
  },
  {
    id: 'matrix_code',
    name: 'Digital Code Rain',
    subtitle: 'Binary digital green code stream',
    cost: 1000,
    icon: '💻',
    color: '#00ff66',
  },
];

interface TrackItem {
  id: string;
  name: string;
  genre: string;
  duration: string;
}

const TRACKS: TrackItem[] = [
  { id: 'default', name: 'Neo-City Cyber Run', genre: 'Synthwave 2099', duration: '3:45' },
  { id: 'billie_jean_synth', name: 'Cyber Billie Jean', genre: 'Retro Synthwave', duration: '4:12' },
  { id: 'thriller_matrix', name: 'Thriller Cyber Matrix', genre: 'Industrial Synth', duration: '5:02' },
  { id: 'smooth_synth', name: 'Smooth Criminal Synth', genre: 'Darksynth Beat', duration: '3:50' },
];

export const PremiumStoreModal: React.FC<PremiumStoreModalProps> = ({
  currentUser,
  onClose,
  onUserChange,
}) => {
  const [activeTab, setActiveTab] = useState<StoreTab>('subscriptions');
  const [message, setMessage] = useState<string | null>(null);

  // Easypaisa & TRX State
  const [epConfig, setEpConfig] = useState(() => EasypaisaService.getConfig());
  const [isEditingEp, setIsEditingEp] = useState<boolean>(false);
  const [epTitle, setEpTitle] = useState(epConfig.accountTitle);
  const [epNumber, setEpNumber] = useState(epConfig.accountNumber);
  const [epQrUrl, setEpQrUrl] = useState(epConfig.qrImageUrl);
  const [epNote, setEpNote] = useState(epConfig.noteInstructions);
  const epFileInputRef = React.useRef<HTMLInputElement | null>(null);

  // TRX Submission State
  const [selectedPackage, setSelectedPackage] = useState<{
    title: string;
    pkr: number;
    usd: number;
    rewardType: 'coins' | 'vip_monthly' | 'vip_annual' | 'vip_lifetime';
    rewardValue: number;
  }>({
    title: '⚡ 50,000 Cyber Coins Mega Pack',
    pkr: 2500,
    usd: 8.99,
    rewardType: 'coins',
    rewardValue: 50000,
  });
  const [inputTrxId, setInputTrxId] = useState<string>('');
  const [trxSubmitted, setTrxSubmitted] = useState<boolean>(false);

  const handleSubmitTrxOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTrxId.trim()) {
      showNotification('Please enter a valid Easypaisa / JazzCash TRX ID');
      return;
    }
    RevenueService.submitTrxPayment({
      userId: currentUser?.id || 'civilian-guest',
      username: currentUser?.username || 'Civilian Runner',
      userEmail: currentUser?.email || 'guest@cyber.io',
      packageTitle: selectedPackage.title,
      amountPkr: selectedPackage.pkr,
      amountUsd: selectedPackage.usd,
      trxId: inputTrxId.trim().toUpperCase(),
      paymentMethod: 'Easypaisa',
      rewardType: selectedPackage.rewardType,
      rewardValue: selectedPackage.rewardValue,
    });
    setTrxSubmitted(true);
    setInputTrxId('');
    showNotification('✅ TRX Payment Submitted! Admin will verify and credit your account shortly.');
  };

  const isVip = currentUser?.isVipPassActive || false;
  const currentTier = currentUser?.subscriptionTier || 'free';
  const expiresAt = currentUser?.subscriptionExpiresAt || 'N/A';
  const autoRenews = currentUser?.autoRenews ?? true;

  const userCoins = currentUser?.cyberCoins || 0;
  const activeSkin = currentUser?.activeSkin || 'default';
  const unlockedSkins = currentUser?.unlockedSkins || ['default'];
  const activeTrail = currentUser?.activeTrail || 'cyan';
  const unlockedTrails = currentUser?.unlockedTrails || ['cyan'];
  const activeTheme = currentUser?.activeTheme || 'cyber_night';
  const unlockedThemes = currentUser?.unlockedThemes || ['cyber_night'];
  const activeTrack = currentUser?.activeSoundtrack || 'default';

  const showNotification = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3500);
  };

  const handleSubscribeTier = (tier: 'runner_monthly' | 'legend_annual' | 'cyber_king_lifetime') => {
    if (!currentUser) {
      showNotification('Please log in to activate subscription!');
      return;
    }
    const updated = AuthService.subscribeTier(currentUser.id, tier);
    if (updated) {
      onUserChange(updated);
      const tierNames = {
        runner_monthly: 'CYBER RUNNER PRO ($4.99/MO)',
        legend_annual: 'CYBER LEGEND VIP ($29.99/YR)',
        cyber_king_lifetime: 'VIP CYBER KING (LIFETIME $49.99)',
      };
      showNotification(`🎉 SUBSCRIBED TO ${tierNames[tier]}! ALL PERKS UNLOCKED!`);
    }
  };

  const handleCancelSubscription = () => {
    if (!currentUser) return;
    const updated = AuthService.cancelSubscription(currentUser.id);
    if (updated) {
      onUserChange(updated);
      showNotification('ℹ️ AUTO-RENEWAL TURNED OFF. SUBSCRIPTION VALID UNTIL EXPIRATION.');
    }
  };

  const handleEquipOrBuySkin = (skin: SkinItem) => {
    if (!currentUser) return;

    const res = AuthService.buyAndEquipSkin(currentUser.id, skin.id, skin.cost);
    if (res.success && res.user) {
      onUserChange(res.user);
      if (unlockedSkins.includes(skin.id)) {
        showNotification(`🕺 EQUIPPED ${skin.name.toUpperCase()}!`);
      } else {
        showNotification(`🎉 UNLOCKED & EQUIPPED ${skin.name.toUpperCase()}!`);
      }
    } else {
      showNotification(`❌ ${res.message || 'Failed to purchase'}`);
    }
  };

  const handleEquipOrBuyTrail = (trail: TrailItem) => {
    if (!currentUser) return;

    const res = AuthService.buyAndEquipTrail(currentUser.id, trail.id, trail.cost);
    if (res.success && res.user) {
      onUserChange(res.user);
      if (unlockedTrails.includes(trail.id)) {
        showNotification(`✨ EQUIPPED ${trail.name.toUpperCase()}!`);
      } else {
        showNotification(`🎉 UNLOCKED & EQUIPPED ${trail.name.toUpperCase()}!`);
      }
    } else {
      showNotification(`❌ ${res.message || 'Failed to purchase'}`);
    }
  };

  const handleEquipOrBuyTheme = (theme: ThemeItem) => {
    if (!currentUser) return;

    const res = AuthService.buyAndEquipTheme(currentUser.id, theme.id, theme.cost);
    if (res.success && res.user) {
      onUserChange(res.user);
      if (unlockedThemes.includes(theme.id)) {
        showNotification(`🌆 EQUIPPED ${theme.name.toUpperCase()}!`);
      } else {
        showNotification(`🎉 UNLOCKED & EQUIPPED ${theme.name.toUpperCase()}!`);
      }
    } else {
      showNotification(`❌ ${res.message || 'Failed to purchase'}`);
    }
  };

  const handleEquipTrack = (trackId: string) => {
    if (!currentUser) return;
    const updated = AuthService.equipSoundtrack(currentUser.id, trackId);
    if (updated) {
      onUserChange(updated);
      showNotification(`🎵 SOUNDTRACK CHANGED!`);
    }
  };

  const handleClaimFreeCoins = (amount: number) => {
    if (!currentUser) return;
    const updated = AuthService.addCoins(currentUser.id, amount);
    if (updated) {
      onUserChange(updated);
      showNotification(`💎 CLAIMED +${amount} FREE CYBER COINS!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md select-none">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl text-white flex flex-col gap-4 max-h-[92vh] overflow-y-auto relative">
        {/* Header Bar */}
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
              <Crown className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-300 tracking-wider flex items-center gap-2">
                <span>PREMIUM VAULT</span>
                {isVip && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400 text-[10px] text-amber-300 font-mono font-bold">
                    VIP ACTIVE
                  </span>
                )}
              </h2>
              <p className="text-xs text-gray-400">Cyber Pass Perks, Skins & Power Boosters</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-950 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs shadow-inner">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{userCoins.toLocaleString()} COINS</span>
            </div>

            <button
              id="close-premium-store-modal-btn"
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Alert Banner */}
        {message && (
          <div className="p-2.5 bg-amber-950/90 border border-amber-400/80 rounded-xl text-amber-200 text-xs font-mono font-bold text-center animate-bounce shadow-lg">
            {message}
          </div>
        )}

        {/* Store Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-x-auto text-xs font-bold font-mono">
          <button
            id="tab-subscriptions"
            onClick={() => setActiveTab('subscriptions')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'subscriptions'
                ? 'bg-amber-500 text-slate-950 font-black shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>SUBSCRIPTIONS</span>
          </button>

          <button
            id="tab-easypaisa"
            onClick={() => setActiveTab('easypaisa')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'easypaisa'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-400" />
            <span>EASYPAISA QR</span>
          </button>

          <button
            id="tab-themes"
            onClick={() => setActiveTab('themes')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'themes'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>VIP THEMES</span>
          </button>

          <button
            id="tab-skins"
            onClick={() => setActiveTab('skins')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'skins'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_12px_rgba(0,243,255,0.5)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>CYBER SKINS</span>
          </button>

          <button
            id="tab-trails"
            onClick={() => setActiveTab('trails')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'trails'
                ? 'bg-fuchsia-500 text-slate-950 font-black shadow-[0_0_12px_rgba(217,70,239,0.5)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>NEON TRAILS</span>
          </button>

          <button
            id="tab-tracks"
            onClick={() => setActiveTab('tracks')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'tracks'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>SOUNDTRACKS</span>
          </button>

          <button
            id="tab-coins"
            onClick={() => setActiveTab('coins')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'coins'
                ? 'bg-yellow-400 text-slate-950 font-black shadow-[0_0_12px_rgba(234,179,8,0.5)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>COINS VAULT</span>
          </button>
        </div>

        {/* TAB 1: SUBSCRIPTIONS & VIP MEMBERSHIPS */}
        {activeTab === 'subscriptions' && (
          <div className="flex flex-col gap-5">
            {/* Active Subscription Status Banner if active */}
            {isVip && (
              <div className="p-4 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border border-amber-400/80 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/20 rounded-xl border border-amber-400/50">
                    <Crown className="w-6 h-6 text-amber-300" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                      ACTIVE SUBSCRIPTION PLAN
                    </span>
                    <span className="text-sm font-black text-white">
                      {currentTier === 'runner_monthly' && '⚡ CYBER RUNNER PRO (MONTHLY)'}
                      {currentTier === 'legend_annual' && '🌟 CYBER LEGEND VIP (ANNUAL)'}
                      {currentTier === 'cyber_king_lifetime' && '👑 VIP CYBER KING (LIFETIME)'}
                      {currentTier === 'free' && '👑 VIP CYBER PASS MEMBER'}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-300" />
                      Status: Valid until {expiresAt}
                    </span>
                  </div>
                </div>

                {autoRenews && currentTier !== 'cyber_king_lifetime' ? (
                  <button
                    id="cancel-subscription-btn"
                    onClick={handleCancelSubscription}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 border border-red-500/40 text-red-300 hover:border-red-400 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Cancel Auto-Renew</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{currentTier === 'cyber_king_lifetime' ? 'Lifetime Access' : 'Auto-Renew Off'}</span>
                  </span>
                )}
              </div>
            )}

            {/* Subscriptions Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* PLAN 1: Monthly Pro */}
              <div
                className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 relative transition ${
                  currentTier === 'runner_monthly'
                    ? 'bg-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.3)]'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider">MONTHLY PASS</span>
                    <span className="p-1.5 bg-cyan-500/20 border border-cyan-400/40 rounded-xl text-cyan-300 text-xs font-black">
                      ⚡ 1.5X XP
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white mt-1">Cyber Runner Pro</h4>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="text-2xl font-black text-cyan-300">$4.99</span>
                    <span className="text-xs text-gray-400 font-mono">/ month</span>
                  </div>
                  <p className="text-[11px] text-gray-400">Perfect for casual runners boosting their cyber levels.</p>

                  <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-slate-800 text-xs text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>1.5X Profile XP Multiplier</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>+1,000 Monthly Cyber Coins</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Golden Auto-Shield Activated</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Smooth Criminal Suit Unlocked</span>
                    </div>
                  </div>
                </div>

                <button
                  id="subscribe-monthly-btn"
                  onClick={() => handleSubscribeTier('runner_monthly')}
                  disabled={currentTier === 'runner_monthly'}
                  className={`w-full py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-1.5 mt-2 ${
                    currentTier === 'runner_monthly'
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md active:scale-95'
                  }`}
                >
                  {currentTier === 'runner_monthly' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>CURRENT PLAN</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>SUBSCRIBE $4.99/MO</span>
                    </>
                  )}
                </button>
              </div>

              {/* PLAN 2: Annual Legend (POPULAR) */}
              <div
                className={`p-4 rounded-2xl border-2 flex flex-col justify-between gap-3 relative transition overflow-hidden ${
                  currentTier === 'legend_annual'
                    ? 'bg-slate-900 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                    : 'bg-gradient-to-b from-amber-950/40 to-slate-950 border-amber-500/80 shadow-lg'
                }`}
              >
                <div className="absolute top-0 right-0 px-2.5 py-0.5 bg-amber-400 text-slate-950 text-[9px] font-black tracking-widest uppercase rounded-bl-xl font-mono">
                  BEST VALUE (SAVE 50%)
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold text-amber-300 tracking-wider">ANNUAL PASS</span>
                    <span className="p-1.5 bg-amber-500/20 border border-amber-400/40 rounded-xl text-amber-300 text-xs font-black">
                      🌟 2.0X XP
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white mt-1">Cyber Legend VIP</h4>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="text-2xl font-black text-amber-300">$29.99</span>
                    <span className="text-xs text-gray-400 font-mono">/ year</span>
                  </div>
                  <p className="text-[11px] text-amber-100/70">Full year of VIP perks, gold suits and double currency.</p>

                  <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-amber-500/30 text-xs text-gray-200">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-bold">2.0X Profile XP Multiplier</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-bold">+3,500 Instant Cyber Coins</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>24K Gold & Smooth Criminal Suits</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Golden Starburst Footstep Trail</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>VIP Crown Badge & Legend Title</span>
                    </div>
                  </div>
                </div>

                <button
                  id="subscribe-annual-btn"
                  onClick={() => handleSubscribeTier('legend_annual')}
                  disabled={currentTier === 'legend_annual'}
                  className={`w-full py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-1.5 mt-2 ${
                    currentTier === 'legend_annual'
                      ? 'bg-amber-500/20 border border-amber-400 text-amber-300'
                      : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-md active:scale-95'
                  }`}
                >
                  {currentTier === 'legend_annual' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>CURRENT PLAN</span>
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 fill-slate-950" />
                      <span>SUBSCRIBE $29.99/YR</span>
                    </>
                  )}
                </button>
              </div>

              {/* PLAN 3: Lifetime King */}
              <div
                className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 relative transition ${
                  currentTier === 'cyber_king_lifetime'
                    ? 'bg-slate-900 border-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.3)]'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold text-fuchsia-400 tracking-wider">LIFETIME KING</span>
                    <span className="p-1.5 bg-fuchsia-500/20 border border-fuchsia-400/40 rounded-xl text-fuchsia-300 text-xs font-black">
                      👑 2.5X XP
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white mt-1">VIP Cyber King</h4>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="text-2xl font-black text-fuchsia-300">$49.99</span>
                    <span className="text-xs text-gray-400 font-mono">one-time</span>
                  </div>
                  <p className="text-[11px] text-gray-400">Never pay again. Permanent ownership of all cyber content.</p>

                  <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-slate-800 text-xs text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                      <span className="font-bold">2.5X Permanent XP Multiplier</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                      <span className="font-bold">+10,000 Instant Cyber Coins</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                      <span>ALL Current & Future Skins Unlocked</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                      <span>ALL Neon Trails & Soundtracks Unlocked</span>
                    </div>
                  </div>
                </div>

                <button
                  id="subscribe-lifetime-btn"
                  onClick={() => handleSubscribeTier('cyber_king_lifetime')}
                  disabled={currentTier === 'cyber_king_lifetime'}
                  className={`w-full py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-1.5 mt-2 ${
                    currentTier === 'cyber_king_lifetime'
                      ? 'bg-fuchsia-500/20 border border-fuchsia-400 text-fuchsia-300'
                      : 'bg-fuchsia-500 hover:bg-fuchsia-400 text-slate-950 shadow-md active:scale-95'
                  }`}
                >
                  {currentTier === 'cyber_king_lifetime' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>PERMANENT KING</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>UNLOCK LIFETIME $49.99</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1.5: EASYPAISA QR PAYMENT */}
        {activeTab === 'easypaisa' && (
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-400/80 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-400/50">
                  <QrCode className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Easypaisa QR Code & Payment Vault</h3>
                  <p className="text-xs text-emerald-300/80">Scan QR Code or transfer directly to Easypaisa Account</p>
                </div>
              </div>

              <button
                onClick={() => setIsEditingEp(!isEditingEp)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 border border-emerald-500/50 text-emerald-300 hover:bg-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingEp ? 'Cancel Editing' : 'Upload / Change QR'}</span>
              </button>
            </div>

            {!isEditingEp ? (
              <div className="flex flex-col md:flex-row items-center gap-5 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                {/* QR Code display */}
                <div className="relative p-3 bg-slate-900 border-2 border-emerald-400/80 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0 flex flex-col items-center">
                  <img
                    src={epConfig.qrImageUrl}
                    alt="Easypaisa QR Code"
                    className="w-48 h-48 object-contain rounded-xl bg-white p-1"
                  />
                  <span className="mt-2 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                    EASYPAISA QR CODE
                  </span>
                </div>

                {/* Info & Copy controls */}
                <div className="flex-1 flex flex-col gap-3 w-full">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="text-[10px] font-mono text-gray-400 uppercase">ACCOUNT TITLE</div>
                      <div className="text-sm font-black text-white">{epConfig.accountTitle}</div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(epConfig.accountTitle);
                        showNotification('Account Title copied to clipboard!');
                      }}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-emerald-300 transition cursor-pointer"
                      title="Copy Title"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-emerald-500/50 flex justify-between items-center">
                    <div>
                      <div className="text-[10px] font-mono text-emerald-400 uppercase">MOBILE / ACCOUNT NUMBER</div>
                      <div className="text-base font-black text-emerald-300 font-mono tracking-wider">{epConfig.accountNumber}</div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(epConfig.accountNumber);
                        showNotification('Easypaisa Account Number copied!');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY</span>
                    </button>
                  </div>

                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-gray-300">
                    <p className="leading-relaxed">{epConfig.noteInstructions}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const updated = {
                    ...epConfig,
                    accountTitle: epTitle.trim() || 'Easypaisa Account',
                    accountNumber: epNumber.trim() || '0300 0000000',
                    qrImageUrl: epQrUrl,
                    noteInstructions: epNote.trim(),
                  };
                  EasypaisaService.saveConfig(updated);
                  setEpConfig(updated);
                  setIsEditingEp(false);
                  showNotification('✅ Saved Easypaisa QR Code & Account details!');
                }}
                className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col gap-3 text-xs"
              >
                <div className="flex flex-col gap-1">
                  <label className="font-mono font-bold text-gray-300 uppercase">Account Title</label>
                  <input
                    type="text"
                    value={epTitle}
                    onChange={(e) => setEpTitle(e.target.value)}
                    required
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono font-bold text-gray-300 uppercase">Easypaisa Mobile Number</label>
                  <input
                    type="text"
                    value={epNumber}
                    onChange={(e) => setEpNumber(e.target.value)}
                    required
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-300 font-mono font-bold outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono font-bold text-gray-300 uppercase">Easypaisa QR Image</label>
                  <div className="flex items-center gap-3">
                    <img src={epQrUrl} alt="QR" className="w-16 h-16 object-contain rounded-lg border border-slate-700 bg-white p-1" />
                    <input
                      type="file"
                      ref={epFileInputRef}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) setEpQrUrl(ev.target.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => epFileInputRef.current?.click()}
                      className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer flex items-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload QR File</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono font-bold text-gray-300 uppercase">Note / Instructions</label>
                  <textarea
                    value={epNote}
                    onChange={(e) => setEpNote(e.target.value)}
                    rows={2}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-emerald-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-wider cursor-pointer shadow-md"
                >
                  Save Easypaisa QR Code
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: SPECIAL VIP THEMES */}
        {activeTab === 'themes' && (
          <div className="flex flex-col gap-3">
            <div className="p-3.5 bg-gradient-to-r from-amber-950 via-slate-900 to-purple-950 border border-amber-400/60 rounded-2xl flex items-center justify-between gap-2 shadow-lg">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-1.5 bg-amber-500/20 rounded-xl border border-amber-400/50">👑</span>
                <div>
                  <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider">
                    VIP DYNAMIC WORLD THEMES
                  </h4>
                  <p className="text-[11px] text-gray-300">
                    Transform your run with animated moons, custom parallax skylines, speed gridlines and particle effects.
                  </p>
                </div>
              </div>
              {isVip && (
                <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 text-[10px] font-mono font-bold shrink-0">
                  ALL UNLOCKED (VIP)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEMES.map((theme) => {
                const isUnlocked = unlockedThemes.includes(theme.id) || (theme.vipFree && isVip);
                const isEquipped = activeTheme === theme.id;

                return (
                  <div
                    key={theme.id}
                    className={`p-4 rounded-2xl border bg-gradient-to-br ${theme.previewGradient} ${theme.borderColor} flex flex-col justify-between gap-3 relative transition hover:scale-[1.01]`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-inner">
                          {theme.icon}
                        </span>
                        <div className="flex flex-col">
                          <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                            <span>{theme.name}</span>
                            {theme.vipFree && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-400 text-amber-300 text-[9px] font-mono font-bold">
                                VIP FREE
                              </span>
                            )}
                          </h4>
                          <p className="text-[11px] text-gray-300">{theme.subtitle}</p>
                        </div>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="flex flex-wrap gap-1.5 my-1">
                      {theme.features.map((feat, fIdx) => (
                        <span
                          key={fIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-900/80 border border-white/10 text-[10px] font-mono text-gray-300"
                        >
                          ✦ {feat}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                      <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        <span>{theme.cost === 0 ? 'FREE' : `${theme.cost} COINS`}</span>
                      </span>

                      {isEquipped ? (
                        <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 font-black text-xs font-mono flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>ACTIVE THEME</span>
                        </span>
                      ) : isUnlocked ? (
                        <button
                          id={`equip-theme-${theme.id}`}
                          onClick={() => handleEquipOrBuyTheme(theme)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                        >
                          EQUIP THEME
                        </button>
                      ) : (
                        <button
                          id={`buy-theme-${theme.id}`}
                          onClick={() => handleEquipOrBuyTheme(theme)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1 shadow-md"
                        >
                          <Lock className="w-3 h-3" />
                          <span>UNLOCK THEME</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: CYBER SKINS */}
        {activeTab === 'skins' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SKINS.map((skin) => {
              const isUnlocked = unlockedSkins.includes(skin.id) || (skin.vipFree && isVip);
              const isEquipped = activeSkin === skin.id;

              return (
                <div
                  key={skin.id}
                  className={`p-4 rounded-2xl border bg-gradient-to-br ${skin.previewBg} ${skin.borderColor} flex flex-col justify-between gap-3 relative transition hover:scale-[1.01]`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 bg-slate-900 border border-slate-800 rounded-2xl">
                        {skin.icon}
                      </span>
                      <div className="flex flex-col">
                        <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                          <span>{skin.name}</span>
                          {skin.vipFree && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-400 text-amber-300 text-[9px] font-mono font-bold">
                              VIP FREE
                            </span>
                          )}
                        </h4>
                        <p className="text-[11px] text-gray-400">{skin.subtitle}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                    <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>{skin.cost === 0 ? 'FREE' : `${skin.cost} COINS`}</span>
                    </span>

                    {isEquipped ? (
                      <span className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-black text-xs font-mono flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>EQUIPPED</span>
                      </span>
                    ) : isUnlocked ? (
                      <button
                        id={`equip-skin-${skin.id}`}
                        onClick={() => handleEquipOrBuySkin(skin)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                      >
                        EQUIP
                      </button>
                    ) : (
                      <button
                        id={`buy-skin-${skin.id}`}
                        onClick={() => handleEquipOrBuySkin(skin)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1 shadow-md"
                      >
                        <Lock className="w-3 h-3" />
                        <span>UNLOCK</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: NEON TRAILS */}
        {activeTab === 'trails' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TRAILS.map((trail) => {
              const isUnlocked = unlockedTrails.includes(trail.id);
              const isEquipped = activeTrail === trail.id;

              return (
                <div
                  key={trail.id}
                  className="p-4 rounded-2xl border border-slate-800 bg-slate-950/80 flex flex-col justify-between gap-3 relative"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-slate-900 border border-slate-800 rounded-2xl">
                      {trail.icon}
                    </span>
                    <div className="flex flex-col">
                      <h4 className="font-extrabold text-sm text-white">{trail.name}</h4>
                      <p className="text-[11px] text-gray-400">{trail.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                    <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>{trail.cost === 0 ? 'FREE' : `${trail.cost} COINS`}</span>
                    </span>

                    {isEquipped ? (
                      <span className="px-3 py-1.5 rounded-xl bg-fuchsia-500/20 border border-fuchsia-400 text-fuchsia-300 font-black text-xs font-mono flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>EQUIPPED</span>
                      </span>
                    ) : isUnlocked ? (
                      <button
                        id={`equip-trail-${trail.id}`}
                        onClick={() => handleEquipOrBuyTrail(trail)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                      >
                        EQUIP
                      </button>
                    ) : (
                      <button
                        id={`buy-trail-${trail.id}`}
                        onClick={() => handleEquipOrBuyTrail(trail)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1 shadow-md"
                      >
                        <Lock className="w-3 h-3" />
                        <span>UNLOCK</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 4: SOUNDTRACKS */}
        {activeTab === 'tracks' && (
          <div className="flex flex-col gap-2.5">
            {TRACKS.map((t) => {
              const isSelected = activeTrack === t.id;

              return (
                <div
                  key={t.id}
                  className={`p-3.5 rounded-2xl border transition flex justify-between items-center ${
                    isSelected
                      ? 'bg-emerald-950/80 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-emerald-400">
                      <Music className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-white">{t.name}</span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {t.genre} • {t.duration}
                      </span>
                    </div>
                  </div>

                  {isSelected ? (
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold text-xs font-mono">
                      PLAYING
                    </span>
                  ) : (
                    <button
                      id={`select-track-${t.id}`}
                      onClick={() => handleEquipTrack(t.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase transition cursor-pointer"
                    >
                      SELECT
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 5: COINS VAULT */}
        {activeTab === 'coins' && (
          <div className="flex flex-col gap-3">
            <div className="p-4 bg-gradient-to-r from-amber-950 to-slate-900 border border-amber-500/60 rounded-2xl flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-xs font-black text-amber-300 tracking-wider">DAILY VIP GIFT</span>
                <span className="text-sm font-bold text-white">+500 Cyber Coins Free</span>
              </div>
              <button
                id="claim-daily-free-coins-btn"
                onClick={() => handleClaimFreeCoins(500)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
              >
                CLAIM +500
              </button>
            </div>

            {/* Real Easypaisa / JazzCash Direct Top-Up Box */}
            <div className="p-4 bg-slate-950 border-2 border-emerald-500/80 rounded-2xl flex flex-col gap-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-black text-white">EASYPAISA DIRECT COIN TOP-UP (PAKISTAN)</h4>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-mono font-black uppercase">
                  INSTANT VERIFICATION
                </span>
              </div>

              {!trxSubmitted ? (
                <form onSubmit={handleSubmitTrxOrder} className="flex flex-col gap-3 text-xs">
                  <p className="text-gray-300">
                    Send funds via Easypaisa to <strong className="text-emerald-300 font-mono">{epConfig.accountNumber} ({epConfig.accountTitle})</strong>, then submit your transaction ID (TRX ID) below:
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 flex flex-col gap-1">
                      <label className="font-mono font-bold text-gray-400 uppercase text-[10px]">Easypaisa TRX ID</label>
                      <input
                        type="text"
                        value={inputTrxId}
                        onChange={(e) => setInputTrxId(e.target.value)}
                        placeholder="e.g. EP-984271049"
                        required
                        className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-300 font-mono font-bold outline-none focus:border-emerald-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="mt-auto py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>SUBMIT TRX</span>
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-3 bg-emerald-500/20 border border-emerald-400 rounded-xl text-xs text-emerald-300 font-bold flex items-center justify-between">
                  <span>✅ TRX Payment Submitted! Your coins will be credited upon admin verification.</span>
                  <button
                    onClick={() => setTrxSubmitted(false)}
                    className="underline text-[10px] text-emerald-200 cursor-pointer ml-2"
                  >
                    Submit Another
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  Sparkles,
  Volume2,
  VolumeX,
  Tv,
  Coins,
  Shield,
  Award,
  ExternalLink,
} from 'lucide-react';
import { RevenueService } from '../services/revenueService';

interface RewardedAdModalProps {
  rewardType: 'revive' | 'double_coins' | 'bonus_coins';
  coinsToDouble?: number;
  onRewardGranted: () => void;
  onClose: () => void;
}

const SPONSORS = [
  {
    name: 'Easypaisa Mobile Wallet',
    tagline: 'Instant Money Transfer & Mobile Payments in Pakistan',
    color: 'from-emerald-600 to-teal-800',
    cta: 'Download Easypaisa App',
    link: 'https://easypaisa.com.pk',
    logo: '💚',
  },
  {
    name: 'Cyber Neon Gear 2099',
    tagline: 'Next-Gen RGB Wireless Gaming Accessories & Visors',
    color: 'from-cyan-600 to-blue-900',
    cta: 'Shop Cyber Specs',
    link: '#',
    logo: '🕶️',
  },
  {
    name: 'MJ Moonwalk Energy Drink',
    tagline: 'Zero Sugar High Voltage Focus Formula for Gamers',
    color: 'from-amber-600 to-red-900',
    cta: 'Get 20% Off Code: MOONWALK',
    link: '#',
    logo: '⚡',
  },
];

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  rewardType,
  coinsToDouble = 500,
  onRewardGranted,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(10); // 10s video ad
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentSponsor] = useState(
    () => SPONSORS[Math.floor(Math.random() * SPONSORS.length)]
  );

  useEffect(() => {
    if (!isPlaying || isCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          setIsPlaying(false);
          // Log impression
          RevenueService.recordAdImpression('rewarded_video', currentSponsor.name, 0.25);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isCompleted, currentSponsor.name]);

  const handleClaimReward = () => {
    onRewardGranted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-400/80 rounded-3xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.3)] flex flex-col gap-5 overflow-hidden font-sans">
        
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/20 border border-amber-400 rounded-xl">
              <Tv className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white uppercase tracking-wider">SPONSORED REWARDED AD</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-mono font-black">
                  AD
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Watch full ad to claim your reward</p>
            </div>
          </div>

          <button
            onClick={isCompleted ? onClose : undefined}
            disabled={!isCompleted}
            className={`p-2 rounded-xl border transition ${
              isCompleted
                ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700 cursor-pointer'
                : 'bg-slate-950/50 border-slate-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Frame */}
        <div className={`relative w-full h-52 rounded-2xl bg-gradient-to-br ${currentSponsor.color} p-5 flex flex-col justify-between overflow-hidden shadow-inner border border-white/20`}>
          {/* Top Info Overlay */}
          <div className="flex justify-between items-start z-10">
            <div className="px-2.5 py-1 bg-slate-950/70 backdrop-blur border border-white/20 rounded-full text-[10px] font-mono text-amber-300 font-bold flex items-center gap-1">
              <span>{currentSponsor.logo}</span>
              <span>{currentSponsor.name}</span>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 bg-slate-950/70 rounded-full text-white hover:bg-slate-950 transition cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>

          {/* Ad Center Content */}
          <div className="flex flex-col items-center justify-center text-center gap-2 z-10 my-auto">
            <div className="text-4xl animate-bounce">{currentSponsor.logo}</div>
            <h3 className="text-lg font-black text-white tracking-wide drop-shadow-md">
              {currentSponsor.name}
            </h3>
            <p className="text-xs text-amber-100/90 max-w-xs font-medium drop-shadow">
              {currentSponsor.tagline}
            </p>
          </div>

          {/* Bottom Action / Timer Bar */}
          <div className="flex items-center justify-between z-10 pt-2 border-t border-white/20">
            {!isCompleted ? (
              <div className="flex items-center gap-2 w-full">
                <div className="flex-1 bg-slate-950/80 rounded-full h-2 overflow-hidden border border-white/20">
                  <div
                    className="bg-amber-400 h-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((10 - timeLeft) / 10) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-black text-amber-300 shrink-0">
                  00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </span>
              </div>
            ) : (
              <a
                href={currentSponsor.link}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-white text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg hover:bg-amber-100 transition"
              >
                <span>{currentSponsor.cta}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Reward Summary Footer */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-gray-400 uppercase">REWARD UNLOCK</span>
            <span className="text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              READY TO CLAIM
            </span>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-400/40 rounded-xl flex items-center gap-3">
            {rewardType === 'revive' && (
              <>
                <Shield className="w-7 h-7 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-xs font-black text-white uppercase">FREE GAME REVIVE + GOLD SHIELD</div>
                  <div className="text-[11px] text-gray-300">Continue your moonwalk run without losing score</div>
                </div>
              </>
            )}

            {rewardType === 'double_coins' && (
              <>
                <Coins className="w-7 h-7 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-black text-white uppercase">2X RUN COINS MULTIPLIER</div>
                  <div className="text-[11px] text-amber-300 font-mono">
                    Earn +{coinsToDouble} Bonus Cyber Coins!
                  </div>
                </div>
              </>
            )}

            {rewardType === 'bonus_coins' && (
              <>
                <Award className="w-7 h-7 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-black text-white uppercase">+1,000 FREE CYBER COINS</div>
                  <div className="text-[11px] text-emerald-300 font-mono">Added directly to your balance</div>
                </div>
              </>
            )}
          </div>

          <button
            id="claim-ad-reward-btn"
            onClick={handleClaimReward}
            disabled={!isCompleted}
            className={`w-full py-3.5 rounded-xl font-black text-xs font-mono uppercase tracking-wider transition flex items-center justify-center gap-2 ${
              isCompleted
                ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:shadow-[0_0_30px_rgba(250,204,21,0.8)] active:scale-95 cursor-pointer animate-pulse'
                : 'bg-slate-800 text-gray-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 fill-slate-950 text-amber-400" />
                <span>CLAIM MY REWARD NOW!</span>
              </>
            ) : (
              <span>WATCHING AD ({timeLeft}s REMAINING)</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { ExternalLink, X, Tv, Sparkles } from 'lucide-react';
import { RevenueService } from '../services/revenueService';

const BANNER_SPONSORS = [
  {
    title: 'Easypaisa - Fast & Secure Mobile Money',
    subtitle: 'Send money, pay bills & scan QR anywhere in Pakistan!',
    cta: 'Download App',
    link: 'https://easypaisa.com.pk',
    logo: '💚',
    bg: 'from-emerald-900/90 to-teal-950/90',
    border: 'border-emerald-500/60',
    text: 'text-emerald-300',
  },
  {
    title: 'Cyber Gaming Visor 2099',
    subtitle: 'Pro Wireless RGB Moonwalk Headset with Ultra-Low Latency',
    cta: 'Get 30% Off',
    link: '#',
    logo: '🕶️',
    bg: 'from-cyan-950/90 to-blue-950/90',
    border: 'border-cyan-500/60',
    text: 'text-cyan-300',
  },
  {
    title: 'MJ Moonwalk Energy Drink',
    tagline: 'High Voltage Cyber Focus for Esports Champions',
    cta: 'Order Pack',
    link: '#',
    logo: '⚡',
    bg: 'from-amber-950/90 to-red-950/90',
    border: 'border-amber-500/60',
    text: 'text-amber-300',
  },
];

export const AdBannerBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNER_SPONSORS.length);
    }, 12000); // Rotate banner every 12s

    // Record impression
    const sp = BANNER_SPONSORS[currentIndex];
    RevenueService.recordAdImpression('banner', sp.title, 0.05);

    return () => clearInterval(interval);
  }, [currentIndex]);

  if (!isVisible) return null;

  const current = BANNER_SPONSORS[currentIndex];

  return (
    <div className="w-full max-w-xl mx-auto my-1 px-2 z-30 font-sans animate-fade-in">
      <div
        className={`p-1.5 sm:p-2 rounded-xl bg-gradient-to-r ${current.bg} border ${current.border} shadow-md flex items-center justify-between gap-2 backdrop-blur-md`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-6 h-6 rounded-lg bg-slate-950 flex items-center justify-center text-sm shrink-0 border border-white/10">
            {current.logo}
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="px-1 py-0.1 rounded bg-amber-400 text-slate-950 text-[8px] font-mono font-black uppercase shrink-0">
                AD
              </span>
              <h4 className="text-[11px] font-black text-white truncate">{current.title}</h4>
            </div>
            <p className="text-[9px] text-gray-300 truncate">{current.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <a
            href={current.link}
            target="_blank"
            rel="noreferrer"
            className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-bold text-[9px] transition flex items-center gap-0.5 border border-white/20"
          >
            <span>{current.cta}</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>

          <button
            onClick={() => setIsVisible(false)}
            className="p-0.5 rounded text-gray-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Hide Ad"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

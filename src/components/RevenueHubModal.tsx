import React, { useState } from 'react';
import {
  X,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  QrCode,
  Tv,
  Settings,
  CreditCard,
  Save,
  Users,
  Coins,
  Crown,
  Copy,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { RevenueService, TrxPayment, RevenueSettings } from '../services/revenueService';
import { AuthService } from '../services/authService';

interface RevenueHubModalProps {
  onClose: () => void;
}

export const RevenueHubModal: React.FC<RevenueHubModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'trx_approval' | 'ad_settings' | 'coin_packages'>('overview');
  const [payments, setPayments] = useState<TrxPayment[]>(() => RevenueService.getTrxPayments());
  const [settings, setSettings] = useState<RevenueSettings>(() => RevenueService.getSettings());
  const [adLogs] = useState(() => RevenueService.getAdLogs());
  const [notification, setNotification] = useState<string | null>(null);

  // Form states for Settings tab
  const [editEpNum, setEditEpNum] = useState(settings.easypaisaNumber);
  const [editEpTitle, setEditEpTitle] = useState(settings.easypaisaTitle);
  const [editJcNum, setEditJcNum] = useState(settings.jazzcashNumber);
  const [editAdPubId, setEditAdPubId] = useState(settings.adsensePublisherId);
  const [editAdUnitId, setEditAdUnitId] = useState(settings.adsenseBannerUnitId);
  const [editCoinRate, setEditCoinRate] = useState(settings.coinRatePkrPer1k);

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const pendingPayments = payments.filter((p) => p.status === 'pending');
  const approvedPayments = payments.filter((p) => p.status === 'approved');
  const totalTrxRevenuePkr = approvedPayments.reduce((acc, p) => acc + p.amountPkr, 0);
  const totalTrxRevenueUsd = approvedPayments.reduce((acc, p) => acc + p.amountUsd, 0);
  const grandTotalEstRevenueUsd = totalTrxRevenueUsd + settings.totalEstAdRevenueUsd;

  const handleApproveTrx = (trxId: string) => {
    const updatedPayment = RevenueService.approveTrxPayment(trxId);
    if (updatedPayment) {
      setPayments(RevenueService.getTrxPayments());
      // Grant reward to active user if matching, or update user
      const currentUser = AuthService.getActiveUser();
      if (currentUser) {
        if (updatedPayment.rewardType === 'coins') {
          AuthService.addCyberCoins(currentUser.id, updatedPayment.rewardValue);
        } else if (updatedPayment.rewardType.startsWith('vip')) {
          const tier = updatedPayment.rewardType === 'vip_lifetime' ? 'cyber_king_lifetime' : 'runner_monthly';
          AuthService.subscribeTier(currentUser.id, tier);
        }
      }
      showNotify(`✅ TRX ${updatedPayment.trxId} Approved & Rewards Credited!`);
    }
  };

  const handleRejectTrx = (trxId: string) => {
    const rejected = RevenueService.rejectTrxPayment(trxId);
    if (rejected) {
      setPayments(RevenueService.getTrxPayments());
      showNotify(`❌ TRX ${rejected.trxId} Rejected.`);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: RevenueSettings = {
      ...settings,
      easypaisaNumber: editEpNum,
      easypaisaTitle: editEpTitle,
      jazzcashNumber: editJcNum,
      adsensePublisherId: editAdPubId,
      adsenseBannerUnitId: editAdUnitId,
      coinRatePkrPer1k: editCoinRate,
    };
    RevenueService.saveSettings(updated);
    setSettings(updated);
    showNotify('✅ Revenue & AdSense Settings Saved Successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-400/80 rounded-3xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.3)] flex flex-col gap-5 max-h-[90vh] overflow-y-auto font-sans">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 border border-amber-400 rounded-2xl">
              <DollarSign className="w-7 h-7 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white tracking-wider">APP REVENUE & MONETIZATION HUB</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-mono text-[10px] font-black uppercase">
                  MONETIZED
                </span>
              </div>
              <p className="text-xs text-amber-200/80">
                Easypaisa TRX Verifications, Rewarded Ads CPM, AdSense Units & Pricing Controls
              </p>
            </div>
          </div>

          <button
            id="close-revenue-hub-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-300 font-bold text-xs text-center animate-bounce shadow-md">
            {notification}
          </div>
        )}

        {/* Revenue Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-x-auto text-xs font-bold font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>REVENUE OVERVIEW</span>
          </button>

          <button
            onClick={() => setActiveTab('trx_approval')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer whitespace-nowrap relative ${
              activeTab === 'trx_approval'
                ? 'bg-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>TRX PAYMENTS</span>
            {pendingPayments.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black">
                {pendingPayments.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ad_settings')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'ad_settings'
                ? 'bg-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>ADSENSE & ADS CONFIG</span>
          </button>

          <button
            onClick={() => setActiveTab('coin_packages')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'coin_packages'
                ? 'bg-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>COIN PRICING PACKS</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-5">
            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Card 1: Total Revenue */}
              <div className="p-4 bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 border-2 border-amber-400/80 rounded-2xl flex flex-col gap-1 shadow-lg">
                <span className="text-[10px] font-mono font-bold text-amber-400 tracking-widest uppercase">
                  ESTIMATED TOTAL REVENUE
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-amber-300">${grandTotalEstRevenueUsd.toFixed(2)}</span>
                  <span className="text-xs text-gray-400 font-mono">(~PKR {(grandTotalEstRevenueUsd * 280).toLocaleString()})</span>
                </div>
                <span className="text-[10px] text-gray-400 mt-1">Easypaisa + AdSense CPM Combined</span>
              </div>

              {/* Card 2: Easypaisa / Direct TRX */}
              <div className="p-4 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/70 rounded-2xl flex flex-col gap-1 shadow-lg">
                <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-widest uppercase">
                  EASYPAISA / TRX REVENUE
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-emerald-300">PKR {totalTrxRevenuePkr.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 font-mono">(${totalTrxRevenueUsd.toFixed(2)})</span>
                </div>
                <span className="text-[10px] text-emerald-300/80 mt-1">
                  {approvedPayments.length} Approved Payments
                </span>
              </div>

              {/* Card 3: Ad CPM Earnings */}
              <div className="p-4 bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950 border border-cyan-500/70 rounded-2xl flex flex-col gap-1 shadow-lg">
                <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-widest uppercase">
                  ADSENSE & REWARDED AD CPM
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-cyan-300">${settings.totalEstAdRevenueUsd.toFixed(2)}</span>
                  <span className="text-xs text-gray-400 font-mono">({settings.totalAdImpressions} Impressions)</span>
                </div>
                <span className="text-[10px] text-cyan-300/80 mt-1">Avg eCPM: $1.20 / 1k views</span>
              </div>
            </div>

            {/* Live Monetization Stream & Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Payment Request Stream */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-black text-amber-300 uppercase flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>Recent TRX Submissions</span>
                  </span>
                  <button
                    onClick={() => setActiveTab('trx_approval')}
                    className="text-[11px] font-bold text-cyan-400 hover:underline"
                  >
                    View All ({payments.length})
                  </button>
                </div>

                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
                  {payments.slice(0, 5).map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{p.username}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{p.trxId} • {p.paymentMethod}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-emerald-400 font-mono">PKR {p.amountPkr}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-black uppercase font-mono ${
                            p.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : p.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-red-500/20 text-red-300 border border-red-500/40'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ad Impression Logs */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-black text-amber-300 uppercase flex items-center gap-1.5">
                    <Tv className="w-4 h-4 text-cyan-400" />
                    <span>Recent Ad Impressions Log</span>
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">Rewarded & Banner</span>
                </div>

                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
                  {adLogs.length === 0 ? (
                    <div className="p-4 text-center text-xs text-gray-500 font-mono">
                      No ad impressions logged yet. Watch a rewarded ad in game!
                    </div>
                  ) : (
                    adLogs.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex flex-col">
                          <span className="font-bold text-white">{log.sponsorName}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{log.type.toUpperCase()} • {log.timestamp}</span>
                        </div>
                        <span className="font-mono font-bold text-cyan-300">+${log.estRevenueUsd.toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRX PAYMENTS APPROVAL CENTER */}
        {activeTab === 'trx_approval' && (
          <div className="flex flex-col gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center justify-between">
              <div>
                <strong>Pakistani Mobile Wallet & TRX Approval Center:</strong> Verify player transfers sent to your Easypaisa/JazzCash account and click Approve to instantly credit coins or VIP passes.
              </div>
              <span className="px-2 py-1 rounded bg-emerald-500 text-slate-950 font-mono font-black text-xs shrink-0">
                {pendingPayments.length} PENDING
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {payments.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500 font-mono bg-slate-950 rounded-2xl">
                  No payment submissions found. Players can submit TRX numbers when buying packages in the VIP Store!
                </div>
              ) : (
                payments.map((p) => (
                  <div
                    key={p.id}
                    className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                      p.status === 'pending'
                        ? 'bg-slate-950 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-slate-950/60 border-slate-800 opacity-80'
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-white">{p.username}</span>
                        <span className="text-xs text-gray-400 font-mono">({p.userEmail})</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase ${
                            p.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500'
                              : p.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500'
                              : 'bg-red-500/20 text-red-300 border border-red-500'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 mt-1">
                        <span className="font-mono text-emerald-400 font-bold">Package: {p.packageTitle}</span>
                        <span>•</span>
                        <span className="font-mono font-black text-amber-300">PKR {p.amountPkr} (${p.amountUsd})</span>
                        <span>•</span>
                        <span className="font-mono text-cyan-300">TRX ID: {p.trxId}</span>
                        <span>•</span>
                        <span className="text-gray-400">{p.createdAt}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {p.status === 'pending' ? (
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <button
                          onClick={() => handleApproveTrx(p.id)}
                          className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1 shadow-md"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>APPROVE & CREDIT</span>
                        </button>

                        <button
                          onClick={() => handleRejectTrx(p.id)}
                          className="px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/50 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>REJECT</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 font-mono italic">
                        Processed on {p.createdAt}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ADSENSE & REWARDED AD CONFIG */}
        {activeTab === 'ad_settings' && (
          <form onSubmit={handleSaveSettings} className="flex flex-col gap-4">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/40 rounded-xl text-xs text-cyan-200">
              📺 <strong>Google AdSense / AdMob & Ad Unit Integration:</strong> Insert your publisher ID and ad unit tags here to connect live web ads and generate CPM revenue.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono font-bold text-gray-300 uppercase">Google AdSense Publisher ID</label>
                <input
                  type="text"
                  value={editAdPubId}
                  onChange={(e) => setEditAdPubId(e.target.value)}
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                  className="p-3 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono font-bold text-gray-300 uppercase">Banner Ad Unit ID</label>
                <input
                  type="text"
                  value={editAdUnitId}
                  onChange={(e) => setEditAdUnitId(e.target.value)}
                  placeholder="1234567890"
                  className="p-3 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono font-bold text-gray-300 uppercase">Easypaisa Receiving Number</label>
                <input
                  type="text"
                  value={editEpNum}
                  onChange={(e) => setEditEpNum(e.target.value)}
                  placeholder="0300 1234567"
                  className="p-3 rounded-xl bg-slate-950 border border-slate-700 text-emerald-300 font-mono text-xs outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono font-bold text-gray-300 uppercase">Easypaisa Account Title</label>
                <input
                  type="text"
                  value={editEpTitle}
                  onChange={(e) => setEditEpTitle(e.target.value)}
                  placeholder="Sameer Faiz"
                  className="p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs font-mono uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>SAVE MONETIZATION SETTINGS</span>
            </button>
          </form>
        )}

        {/* TAB 4: COIN PRICING PACKAGES */}
        {activeTab === 'coin_packages' && (
          <div className="flex flex-col gap-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/40 rounded-xl text-xs text-amber-200">
              🪙 <strong>Coin Pricing Packages:</strong> Set your local Pakistani pricing (PKR) and international pricing ($) for coin top-ups.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">STARTER PACK</span>
                <span className="text-xl font-black text-white">10,000 Cyber Coins</span>
                <span className="text-base font-black text-emerald-400 font-mono">PKR 500 ($1.99)</span>
                <p className="text-[11px] text-gray-400">Basic coin top-up for cosmetics</p>
              </div>

              <div className="p-4 bg-slate-950 border-2 border-amber-400/80 rounded-2xl flex flex-col gap-2 relative shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <span className="absolute top-0 right-0 px-2 py-0.5 bg-amber-400 text-slate-950 text-[9px] font-black uppercase font-mono rounded-bl-xl">
                  POPULAR
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">MEGA BOOSTER</span>
                <span className="text-xl font-black text-white">50,000 Cyber Coins</span>
                <span className="text-base font-black text-amber-300 font-mono">PKR 2,500 ($8.99)</span>
                <p className="text-[11px] text-amber-100/70">Best value for unlocking rare skins</p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col gap-2">
                <span className="text-xs font-mono font-bold text-fuchsia-400">CYBER KING TREASURE</span>
                <span className="text-xl font-black text-white">150,000 Cyber Coins</span>
                <span className="text-base font-black text-fuchsia-300 font-mono">PKR 6,500 ($24.99)</span>
                <p className="text-[11px] text-gray-400">Massive currency vault for elite runners</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

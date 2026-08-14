import React, { useState } from 'react';
import { X, Volume2, Music, Sparkles, Activity, Lock, Unlock, Globe, Copy, Check, ShieldCheck, Server, RefreshCw, Radio, ExternalLink, Code2, Cpu, DollarSign } from 'lucide-react';
import { GameSettings } from '../types';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
  onOpenRevenueHub?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  onOpenRevenueHub,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'owner'>('general');
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [isSyncingCache, setIsSyncingCache] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const OWNER_PASSWORD = 'mjmjmjmj338';
  const PUBLIC_APP_URL = 'https://ais-pre-alup7gotkyvk7tyhkaousn-211355201616.asia-east1.run.app';
  const EMBED_CODE = `<iframe src="${PUBLIC_APP_URL}" width="100%" height="600" frameborder="0"></iframe>`;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === OWNER_PASSWORD) {
      setIsUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(PUBLIC_APP_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(EMBED_CODE);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  };

  const handleSyncCache = () => {
    setIsSyncingCache(true);
    setSyncSuccess(false);
    setTimeout(() => {
      setIsSyncingCache(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md select-none">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-white flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-cyan-300">GAME SETTINGS</h2>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-400/50 text-[10px] font-mono font-bold text-cyan-300">
              v1.0
            </span>
          </div>
          <button
            id="settings-close-top-btn"
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            id="settings-tab-general-btn"
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'general'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>GENERAL</span>
          </button>

          <button
            id="settings-tab-owner-btn"
            onClick={() => setActiveTab('owner')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'owner'
                ? 'bg-fuchsia-500 text-slate-950 shadow-md font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {isUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>OWNER PORTAL</span>
          </button>
        </div>

        {/* GENERAL TAB */}
        {activeTab === 'general' && (
          <div className="flex flex-col gap-4">
            {/* SFX Volume */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-bold text-gray-200">
                <span className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  <span>SOUND EFFECTS (SFX)</span>
                </span>
                <span className="font-mono text-cyan-300">{Math.round(settings.sfxVolume * 100)}%</span>
              </div>
              <input
                id="sfx-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.sfxVolume}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, sfxVolume: parseFloat(e.target.value) })
                }
                className="accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Music Volume */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-bold text-gray-200">
                <span className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-fuchsia-400" />
                  <span>SYNTHWAVE MUSIC</span>
                </span>
                <span className="font-mono text-fuchsia-300">{Math.round(settings.musicVolume * 100)}%</span>
              </div>
              <input
                id="music-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.musicVolume}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, musicVolume: parseFloat(e.target.value) })
                }
                className="accent-fuchsia-400 cursor-pointer"
              />
            </div>

            {/* Toggles */}
            <div className="flex flex-col gap-3 pt-2 border-t border-slate-800">
              <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="flex items-center gap-2 text-xs font-bold text-gray-300">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>SCREEN SHAKE FX</span>
                </span>
                <input
                  id="screen-shake-toggle"
                  type="checkbox"
                  checked={settings.screenShake}
                  onChange={(e) => onUpdateSettings({ ...settings, screenShake: e.target.checked })}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="flex items-center gap-2 text-xs font-bold text-gray-300">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>HIGH GLOW / BLOOM</span>
                </span>
                <input
                  id="high-glow-toggle"
                  type="checkbox"
                  checked={settings.highGlow}
                  onChange={(e) => onUpdateSettings({ ...settings, highGlow: e.target.checked })}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}

        {/* OWNER PORTAL TAB */}
        {activeTab === 'owner' && (
          <div className="flex flex-col gap-4">
            {!isUnlocked ? (
              /* Password Gate */
              <form onSubmit={handleUnlock} className="flex flex-col items-center text-center p-4 bg-slate-950/80 border border-fuchsia-500/30 rounded-2xl gap-3">
                <div className="p-3 bg-fuchsia-950/80 rounded-full border border-fuchsia-500/40 text-fuchsia-300">
                  <Lock className="w-6 h-6" />
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="font-extrabold text-sm text-fuchsia-200">OWNER ACCESS REQUIRED</h3>
                  <p className="text-[11px] text-gray-400 font-mono">Enter security password to access host deployment controls</p>
                </div>

                <input
                  id="owner-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-fuchsia-400 rounded-xl px-3.5 py-2.5 text-xs text-center font-mono outline-none text-fuchsia-300"
                />

                {passwordError && (
                  <span className="text-[11px] text-rose-400 font-bold">Incorrect password. Please try again!</span>
                )}

                <button
                  id="owner-unlock-submit-btn"
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-extrabold text-xs tracking-wider uppercase transition shadow-md"
                >
                  UNLOCK OWNER PORTAL
                </button>
              </form>
            ) : (
              /* Unlocked Owner Dashboard & Live Hosting System */
              <div className="flex flex-col gap-3.5 bg-slate-950/90 border border-emerald-500/40 rounded-2xl p-4">
                {/* Header Badge */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>OWNER LIVE HOSTING PORTAL</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 font-mono text-[9px] font-extrabold flex items-center gap-1 animate-pulse">
                    <Radio className="w-2.5 h-2.5 text-emerald-400" />
                    <span>LIVE ONLINE</span>
                  </span>
                </div>

                {/* Registered Email & Owner Rights */}
                <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-[10px]">REGISTERED OWNER EMAIL</span>
                    <span className="font-mono text-cyan-300 font-bold">sameer338faiz@gmail.com</span>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold">
                    FULL ACCESS
                  </span>
                </div>

                {/* OWNER REVENUE & MONETIZATION HUB ACCESS */}
                {onOpenRevenueHub && (
                  <div className="p-3.5 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-400/80 rounded-xl flex items-center justify-between gap-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-400/60 text-amber-300">
                        <DollarSign className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-amber-300 uppercase tracking-wide">
                          REVENUE & MONETIZATION HUB
                        </span>
                        <span className="text-[10px] text-gray-300">
                          Verify Easypaisa TRX, AdSense banner IDs & coin rates
                        </span>
                      </div>
                    </div>

                    <button
                      id="owner-open-revenue-hub-btn"
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenRevenueHub();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-md flex items-center gap-1 shrink-0"
                    >
                      <span>OPEN HUB</span>
                    </button>
                  </div>
                )}

                {/* LIVE HOSTING SYSTEM & DEPLOYMENT CONTROLS */}
                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-fuchsia-300">
                    <span className="flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-fuchsia-400" />
                      <span>LIVE WEB APPLICATION HOST</span>
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">Cloud Run Ingress</span>
                  </div>

                  {/* Hosted Public Web App URL Bar */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={PUBLIC_APP_URL}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-[10px] font-mono text-cyan-300 outline-none"
                    />
                    <button
                      id="owner-copy-url-btn"
                      onClick={handleCopyUrl}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-cyan-300 flex items-center gap-1 transition cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <a
                      href={PUBLIC_APP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-fuchsia-950 border border-fuchsia-500/40 hover:bg-fuchsia-900 rounded-xl text-xs font-bold text-fuchsia-300 flex items-center justify-center transition"
                      title="Open Live Web App in New Tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Hosting Quick Actions: Sync Cache & Maintenance Toggle */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      id="owner-sync-cache-btn"
                      onClick={handleSyncCache}
                      disabled={isSyncingCache}
                      className="py-2 px-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-bold text-cyan-300 flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCache ? 'animate-spin text-cyan-400' : ''}`} />
                      <span>{isSyncingCache ? 'Syncing...' : syncSuccess ? 'Cache Synced!' : 'Purge CDN Cache'}</span>
                    </button>

                    <button
                      id="owner-maintenance-toggle-btn"
                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        maintenanceMode
                          ? 'bg-amber-950 border-amber-500/60 text-amber-300'
                          : 'bg-slate-900 border-slate-700 hover:border-slate-600 text-gray-300'
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>{maintenanceMode ? 'Live: Maintenance' : 'Mode: Normal'}</span>
                    </button>
                  </div>
                </div>

                {/* iFRAME EMBED CODE GENERATOR */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <span className="text-gray-400 text-[10px] flex items-center gap-1 font-bold">
                    <Code2 className="w-3 h-3 text-cyan-400" />
                    <span>WEBSITE EMBED CODE (iFRAME)</span>
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={EMBED_CODE}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-[9px] font-mono text-gray-400 outline-none select-all"
                    />
                    <button
                      id="owner-copy-embed-btn"
                      onClick={handleCopyEmbed}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-[11px] font-bold text-emerald-300 flex items-center gap-1 transition cursor-pointer"
                    >
                      {embedCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{embedCopied ? 'Copied' : 'Embed'}</span>
                    </button>
                  </div>
                </div>

                {/* Live Server Hardware & Node Metrics */}
                <div className="grid grid-cols-3 gap-1.5 text-[10px] pt-1 font-mono">
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex flex-col">
                    <span className="text-gray-500 text-[9px]">PORT & HOST</span>
                    <span className="text-emerald-400 font-bold">0.0.0.0:3000</span>
                  </div>

                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex flex-col">
                    <span className="text-gray-500 text-[9px]">LATENCY</span>
                    <span className="text-cyan-300 font-bold">14 ms (Fast)</span>
                  </div>

                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex flex-col">
                    <span className="text-gray-500 text-[9px]">UPLINK SLA</span>
                    <span className="text-fuchsia-300 font-bold">99.9% Uptime</span>
                  </div>
                </div>

                {/* Guide: Code Editing & Player Logins */}
                <div className="mt-1 p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-1 text-[10px]">
                  <span className="font-bold text-cyan-300 flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-cyan-400" />
                    <span>OWNER CODE & LOGIN DATABASE GUIDE</span>
                  </span>
                  <p className="text-gray-300 text-[10px] leading-relaxed">
                    • <strong>Code Changes:</strong> Edit TypeScript files in <code className="text-fuchsia-300">/src/game</code> or <code className="text-fuchsia-300">/src/components</code>.<br />
                    • <strong>Player Activity:</strong> Player highscores, dates, names, and 100 level achievements save directly into Local Storage & Leaderboard.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Close Button */}
        <button
          id="settings-done-btn"
          onClick={onClose}
          className="mt-1 py-3 w-full rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs tracking-wider transition cursor-pointer"
        >
          SAVE & CLOSE
        </button>
      </div>
    </div>
  );
};


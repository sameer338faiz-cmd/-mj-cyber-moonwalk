import React, { useState } from 'react';
import { X, User, LogIn, UserPlus, LogOut, Trophy, Shield, Sparkles, Check, Flame, Edit3, Save, Star, Route, Mail, Key, Crown, CreditCard, Calendar, QrCode } from 'lucide-react';
import { UserAccount, AuthTab } from '../types';
import { AuthService } from '../services/authService';

interface UserProfileModalProps {
  currentUser: UserAccount | null;
  onClose: () => void;
  onUserChange: (user: UserAccount | null) => void;
  onOpenEasypaisa?: () => void;
}

const AVATAR_OPTIONS = ['🕺', '🎩', '⚡', '👑', '🕶️', '🌌', '💎', '🤖', '💥', '🌟'];
const TITLE_OPTIONS = [
  'Neon Rookie',
  'Grid Runner',
  'Smooth Moonwalker',
  'Thriller Master',
  'Dangerous Agent',
  'MJ Cyber Legend',
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  currentUser,
  onClose,
  onUserChange,
  onOpenEasypaisa,
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>(currentUser ? 'profile' : 'login');
  
  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register State
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAvatar, setRegAvatar] = useState('🕺');
  const [regError, setRegError] = useState('');

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(currentUser?.username || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editTitle, setEditTitle] = useState(currentUser?.title || 'Cyber Moonwalker');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || '🕺');

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your username or email');
      return;
    }

    const res = AuthService.login(loginIdentifier);
    if (res.success && res.user) {
      onUserChange(res.user);
      setActiveTab('profile');
      setLoginError('');
      // Auto close after successful login
      onClose();
    } else {
      setLoginError(res.message || 'Login failed');
    }
  };

  // Quick Demo Login
  const handleDemoLogin = (username: string) => {
    const res = AuthService.login(username);
    if (res.success && res.user) {
      onUserChange(res.user);
      setActiveTab('profile');
      setLoginError('');
      // Auto close after successful login
      onClose();
    }
  };

  // Handle Register
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername.trim() || !regEmail.trim()) {
      setRegError('Username and email are required');
      return;
    }

    const res = AuthService.register(regUsername, regEmail, regAvatar);
    if (res.success && res.user) {
      onUserChange(res.user);
      setActiveTab('profile');
      setRegError('');
      // Auto close after successful registration
      onClose();
    } else {
      setRegError(res.message || 'Registration failed');
    }
  };

  // Handle Save Profile Updates
  const handleSaveProfile = () => {
    if (!currentUser) return;
    const updated = AuthService.updateProfile(currentUser.id, {
      username: editUsername.trim() || currentUser.username,
      bio: editBio.trim(),
      title: editTitle,
      avatar: editAvatar,
    });
    if (updated) {
      onUserChange(updated);
      setIsEditing(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    AuthService.logout();
    onUserChange(null);
    setActiveTab('login');
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md select-none">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl text-white flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-950/80 rounded-xl border border-cyan-500/40 text-cyan-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-cyan-300">USER PROFILE & ACCOUNT</h2>
              <p className="text-[10px] text-gray-400 font-mono">Cyber Runner Player Portal</p>
            </div>
          </div>

          <button
            id="user-profile-close-btn"
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          {currentUser && (
            <button
              id="user-tab-profile-btn"
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>PROFILE</span>
            </button>
          )}

          <button
            id="user-tab-login-btn"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-fuchsia-500 text-slate-950 shadow-md font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>SIGN IN</span>
          </button>

          <button
            id="user-tab-register-btn"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>REGISTER</span>
          </button>
        </div>

        {/* TAB 1: PROFILE VIEW */}
        {activeTab === 'profile' && currentUser && (
          <div className="flex flex-col gap-4">
            {/* User Identity Card */}
            <div className="p-4 bg-slate-950/80 border border-cyan-500/40 rounded-2xl flex flex-col gap-3 relative">
              <button
                id="edit-profile-toggle-btn"
                onClick={() => {
                  setEditUsername(currentUser.username);
                  setEditBio(currentUser.bio);
                  setEditTitle(currentUser.title);
                  setEditAvatar(currentUser.avatar);
                  setIsEditing(!isEditing);
                }}
                className="absolute top-3 right-3 p-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
              </button>

              {!isEditing ? (
                /* View Mode */
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-900 to-fuchsia-950 border border-cyan-400/60 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(0,243,255,0.3)] shrink-0">
                      {currentUser.avatar}
                    </div>

                    <div className="flex flex-col gap-0.5 pr-14">
                      <h3 className="font-extrabold text-base text-white tracking-wide flex items-center gap-1.5">
                        <span>{currentUser.username}</span>
                      </h3>

                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-fuchsia-950 border border-fuchsia-500/40 text-fuchsia-300 font-mono text-[10px] font-bold">
                          {currentUser.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold">
                          LVL {currentUser.playerLevel || 1}
                        </span>
                      </div>

                      <span className="text-[10px] text-gray-400 font-mono mt-0.5">{currentUser.email}</span>
                    </div>
                  </div>

                  {/* Player Level & XP Progress Bar */}
                  <div className="flex flex-col gap-1 p-2 bg-slate-900/90 border border-slate-800 rounded-xl">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-cyan-400 font-bold">PLAYER EXPERIENCE (XP)</span>
                      <span className="text-gray-300 font-bold">
                        {currentUser.xp || 0} / {AuthService.getXpNextLevel(currentUser.playerLevel || 1)} XP
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 border border-slate-800 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(0,243,255,0.6)]"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(
                              ((currentUser.xp || 0) / AuthService.getXpNextLevel(currentUser.playerLevel || 1)) * 100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <div className="flex flex-col gap-3 pt-1">
                  <span className="text-xs font-extrabold text-cyan-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>EDIT RUNNER PROFILE</span>
                  </span>

                  {/* Avatar Picker */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400 font-mono">SELECT AVATAR EMOJI</span>
                    <div className="flex flex-wrap gap-1.5">
                      {AVATAR_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setEditAvatar(emoji)}
                          className={`w-8 h-8 rounded-xl border flex items-center justify-center text-lg cursor-pointer transition ${
                            editAvatar === emoji
                              ? 'bg-cyan-500 border-white scale-110 shadow-md'
                              : 'bg-slate-900 border-slate-700 hover:border-cyan-400'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Username */}
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                  />

                  {/* Title Picker */}
                  <select
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-fuchsia-400 rounded-xl px-3 py-2 text-xs font-mono text-fuchsia-300 outline-none cursor-pointer"
                  >
                    {TITLE_OPTIONS.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>

                  {/* Bio */}
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Short Cyber Bio..."
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-mono text-gray-200 outline-none resize-none"
                  />

                  <button
                    onClick={handleSaveProfile}
                    className="py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE CHANGES</span>
                  </button>
                </div>
              )}

              {!isEditing && currentUser.bio && (
                <p className="text-xs text-gray-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 italic">
                  "{currentUser.bio}"
                </p>
              )}

              {/* Active Subscription Status */}
              <div className="p-3 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-400/60 rounded-xl flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-bold text-amber-300 uppercase">
                      SUBSCRIPTION PLAN
                    </span>
                    <span className="font-extrabold text-white">
                      {currentUser.subscriptionTier === 'runner_monthly' && '⚡ Cyber Runner Pro ($4.99/mo)'}
                      {currentUser.subscriptionTier === 'legend_annual' && '🌟 Cyber Legend VIP ($29.99/yr)'}
                      {currentUser.subscriptionTier === 'cyber_king_lifetime' && '👑 VIP Cyber King (Lifetime)'}
                      {(!currentUser.subscriptionTier || currentUser.subscriptionTier === 'free') &&
                        (currentUser.isVipPassActive ? '👑 VIP Cyber Pass Member' : 'Free Civilian Runner')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end text-[10px] text-gray-400 font-mono">
                  <span>{currentUser.subscriptionExpiresAt ? `Valid: ${currentUser.subscriptionExpiresAt}` : 'No Active Plan'}</span>
                  <span className="text-amber-400 font-bold">{currentUser.isVipPassActive ? '2X XP Active' : '1X Base XP'}</span>
                </div>
              </div>

              {/* Equipped Gear & Active Theme */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col gap-2">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>EQUIPPED LOADOUT & THEME</span>
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
                  <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800 flex flex-col">
                    <span className="text-[9px] text-gray-400">SKIN</span>
                    <span className="font-bold text-cyan-300 capitalize truncate">{currentUser.activeSkin?.replace('_', ' ') || 'Default'}</span>
                  </div>
                  <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800 flex flex-col">
                    <span className="text-[9px] text-gray-400">TRAIL</span>
                    <span className="font-bold text-fuchsia-300 capitalize truncate">{currentUser.activeTrail || 'Cyan'}</span>
                  </div>
                  <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800 flex flex-col">
                    <span className="text-[9px] text-amber-400">THEME</span>
                    <span className="font-bold text-amber-300 capitalize truncate">{currentUser.activeTheme?.replace('_', ' ') || 'Cyber Night'}</span>
                  </div>
                </div>
              </div>

              {/* Easypaisa QR Quick Vault */}
              {onOpenEasypaisa && (
                <button
                  type="button"
                  id="profile-open-easypaisa-btn"
                  onClick={() => {
                    onClose();
                    onOpenEasypaisa();
                  }}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-400/80 hover:border-emerald-300 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-300 transition cursor-pointer shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>Manage / View Easypaisa QR Code</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-mono font-black uppercase">
                    OPEN
                  </span>
                </button>
              )}
            </div>

            {/* Lifetime Stats Dashboard */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span>HIGH SCORE</span>
                </span>
                <span className="text-base font-black font-mono text-amber-300">
                  {currentUser.highScore.toLocaleString()}
                </span>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">
                  <Route className="w-3 h-3 text-emerald-400" />
                  <span>MAX LEVEL REACHED</span>
                </span>
                <span className="text-base font-black font-mono text-emerald-400">
                  Level {currentUser.levelReached} / 100
                </span>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">
                  <Flame className="w-3 h-3 text-cyan-400" />
                  <span>TOTAL DISTANCE</span>
                </span>
                <span className="text-sm font-bold font-mono text-cyan-300">
                  {currentUser.totalDistance.toLocaleString()} m
                </span>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">
                  <Star className="w-3 h-3 text-fuchsia-400" />
                  <span>TOTAL ORBS</span>
                </span>
                <span className="text-sm font-bold font-mono text-fuchsia-300">
                  💎 {currentUser.totalOrbs.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Logout Action */}
            <button
              id="user-logout-btn"
              onClick={handleLogout}
              className="py-3 rounded-2xl bg-slate-950 border border-rose-500/40 hover:bg-rose-950/40 text-rose-300 font-extrabold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>SIGN OUT OF ACCOUNT</span>
            </button>
          </div>
        )}

        {/* TAB 2: SIGN IN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 text-center py-1">
              <h3 className="font-extrabold text-sm text-fuchsia-300">WELCOME BACK, CYBER RUNNER</h3>
              <p className="text-[11px] text-gray-400 font-mono">Sign in to sync high scores and 100 level progress</p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-cyan-400" />
                  <span>USERNAME OR EMAIL</span>
                </span>
                <input
                  id="login-identifier-input"
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. Neo_MJ_23 or neo@cyber.app"
                  className="bg-slate-950 border border-slate-800 focus:border-fuchsia-400 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white outline-none"
                />
              </div>

              {loginError && (
                <span className="text-xs text-rose-400 font-bold text-center bg-rose-950/60 p-2 rounded-xl border border-rose-500/40">
                  {loginError}
                </span>
              )}

              <button
                id="login-submit-btn"
                type="submit"
                className="py-3 rounded-2xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
              >
                SIGN IN
              </button>
            </div>

            {/* Quick Demo Test Logins & Guest Mode */}
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-gray-500 text-center uppercase tracking-wider">
                OR QUICK SIGN IN WITH DEMO PRESETS
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('Neo_MJ_23')}
                  className="py-2 px-2.5 bg-slate-950 border border-slate-800 hover:border-cyan-400 rounded-xl text-[11px] font-bold text-cyan-300 transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>🕺 Neo_MJ_23</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('Smooth_Criminal')}
                  className="py-2 px-2.5 bg-slate-950 border border-slate-800 hover:border-fuchsia-400 rounded-xl text-[11px] font-bold text-fuchsia-300 transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>🎩 Smooth_Criminal</span>
                </button>
              </div>

              <button
                type="button"
                id="login-guest-btn"
                onClick={onClose}
                className="mt-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold text-xs uppercase tracking-wider transition cursor-pointer text-center"
              >
                CONTINUE AS GUEST 👤
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: REGISTER */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 text-center py-1">
              <h3 className="font-extrabold text-sm text-emerald-300">CREATE NEW CYBER RUNNER ACCOUNT</h3>
              <p className="text-[11px] text-gray-400 font-mono">Join the 100 level Moonwalk runner leaderboard</p>
            </div>

            {/* Avatar Selector */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-gray-400">CHOOSE YOUR AVATAR</span>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setRegAvatar(emoji)}
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg cursor-pointer transition ${
                      regAvatar === emoji
                        ? 'bg-emerald-500 border-white scale-110 shadow-md'
                        : 'bg-slate-950 border-slate-800 hover:border-emerald-400'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400">USERNAME</span>
                <input
                  id="reg-username-input"
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Enter Username"
                  className="bg-slate-950 border border-slate-800 focus:border-emerald-400 rounded-xl px-3.5 py-2 text-xs font-mono text-white outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-400">EMAIL ADDRESS</span>
                <input
                  id="reg-email-input"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="runner@cyber.app"
                  className="bg-slate-950 border border-slate-800 focus:border-emerald-400 rounded-xl px-3.5 py-2 text-xs font-mono text-white outline-none"
                />
              </div>

              {regError && (
                <span className="text-xs text-rose-400 font-bold text-center bg-rose-950/60 p-2 rounded-xl border border-rose-500/40">
                  {regError}
                </span>
              )}

              <button
                id="reg-submit-btn"
                type="submit"
                className="mt-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
              >
                CREATE ACCOUNT & SIGN IN
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

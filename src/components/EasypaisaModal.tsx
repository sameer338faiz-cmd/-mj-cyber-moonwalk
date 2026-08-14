import React, { useState, useRef } from 'react';
import {
  X,
  QrCode,
  Copy,
  Check,
  Upload,
  Edit3,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Smartphone,
  UserCheck,
  FileText,
} from 'lucide-react';
import { EasypaisaService, EasypaisaConfig } from '../services/easypaisaService';

interface EasypaisaModalProps {
  onClose: () => void;
}

export const EasypaisaModal: React.FC<EasypaisaModalProps> = ({ onClose }) => {
  const [config, setConfig] = useState<EasypaisaConfig>(() => EasypaisaService.getConfig());
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copiedNumber, setCopiedNumber] = useState<boolean>(false);
  const [copiedTitle, setCopiedTitle] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form states for editing
  const [editTitle, setEditTitle] = useState<string>(config.accountTitle);
  const [editNumber, setEditNumber] = useState<string>(config.accountNumber);
  const [editQrUrl, setEditQrUrl] = useState<string>(config.qrImageUrl);
  const [editNote, setEditNote] = useState<string>(config.noteInstructions);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(config.accountNumber);
    setCopiedNumber(true);
    showNotify('Account Number copied to clipboard!');
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleCopyTitle = () => {
    navigator.clipboard.writeText(config.accountTitle);
    setCopiedTitle(true);
    showNotify('Account Title copied to clipboard!');
    setTimeout(() => setCopiedTitle(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotify('Image size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditQrUrl(event.target.result as string);
          showNotify('New QR Code image loaded successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: EasypaisaConfig = {
      ...config,
      accountTitle: editTitle.trim() || 'Easypaisa Account',
      accountNumber: editNumber.trim() || '0300 0000000',
      qrImageUrl: editQrUrl,
      noteInstructions: editNote.trim(),
    };
    EasypaisaService.saveConfig(updated);
    setConfig(updated);
    setIsEditing(false);
    showNotify('✅ Easypaisa QR Code & Account details updated!');
  };

  const handleReset = () => {
    const def = EasypaisaService.resetDefault();
    setConfig(def);
    setEditTitle(def.accountTitle);
    setEditNumber(def.accountNumber);
    setEditQrUrl(def.qrImageUrl);
    setEditNote(def.noteInstructions);
    setIsEditing(false);
    showNotify('Restored default Easypaisa setup!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-emerald-500/80 rounded-3xl p-6 shadow-[0_0_40px_rgba(16,185,129,0.3)] flex flex-col gap-5 max-h-[90vh] overflow-y-auto font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 border border-emerald-400 rounded-2xl">
              <QrCode className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-wider">EASYPAISA QR VAULT</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-mono text-[10px] font-black uppercase">
                  VERIFIED
                </span>
              </div>
              <p className="text-xs text-emerald-300/80">Scan QR or Transfer via Easypaisa Account</p>
            </div>
          </div>

          <button
            id="close-easypaisa-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold text-xs text-center animate-bounce shadow-md">
            {notification}
          </div>
        )}

        {!isEditing ? (
          /* DISPLAY MODE */
          <div className="flex flex-col items-center gap-5">
            {/* QR Code Container */}
            <div className="relative p-4 bg-slate-950 border-2 border-emerald-400/80 rounded-3xl shadow-[0_0_25px_rgba(16,185,129,0.25)] flex flex-col items-center justify-center group">
              <img
                src={config.qrImageUrl}
                alt="Easypaisa QR Code"
                className="w-56 h-56 object-contain rounded-2xl border border-slate-800 shadow-lg bg-white p-2"
              />

              <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-500/50 rounded-full text-[11px] font-mono font-bold text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Easypaisa Payment QR Code</span>
              </div>
            </div>

            {/* Account Details Box */}
            <div className="w-full flex flex-col gap-3 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl">
              {/* Account Title */}
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono font-bold text-gray-400 uppercase">ACCOUNT TITLE</div>
                    <div className="text-sm font-black text-white">{config.accountTitle}</div>
                  </div>
                </div>

                <button
                  id="copy-easypaisa-title-btn"
                  onClick={handleCopyTitle}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-emerald-300 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                  title="Copy Title"
                >
                  {copiedTitle ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Mobile / Account Number */}
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-emerald-500/40">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase">MOBILE / ACCOUNT NUMBER</div>
                    <div className="text-base font-black text-emerald-300 font-mono tracking-wider">{config.accountNumber}</div>
                  </div>
                </div>

                <button
                  id="copy-easypaisa-number-btn"
                  onClick={handleCopyNumber}
                  className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition cursor-pointer flex items-center gap-1.5 text-xs shadow-md"
                >
                  {copiedNumber ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>COPY NUMBER</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instructions / Notes */}
              {config.noteInstructions && (
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-gray-300 flex items-start gap-2">
                  <FileText className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{config.noteInstructions}</p>
                </div>
              )}
            </div>

            {/* Action Edit Button */}
            <div className="w-full flex items-center gap-2">
              <button
                id="edit-easypaisa-qr-btn"
                onClick={() => setIsEditing(true)}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-emerald-500/50 text-emerald-300 font-extrabold text-xs tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Upload / Change My Easypaisa QR</span>
              </button>
            </div>
          </div>
        ) : (
          /* EDIT / UPLOAD FORM MODE */
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-xs text-emerald-200">
              ✏️ <strong>Update Easypaisa Details:</strong> You can upload your own QR code image and enter your account title & number to display in the game.
            </div>

            {/* Account Title Field */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono font-bold text-gray-300 uppercase">Account Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="e.g. Sameer Faiz"
                required
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-emerald-400 outline-none"
              />
            </div>

            {/* Account Number Field */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono font-bold text-gray-300 uppercase">Easypaisa Mobile Number</label>
              <input
                type="text"
                value={editNumber}
                onChange={(e) => setEditNumber(e.target.value)}
                placeholder="e.g. 0300 1234567"
                required
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-300 text-sm font-mono focus:border-emerald-400 outline-none"
              />
            </div>

            {/* QR Code Upload / Image Preview */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono font-bold text-gray-300 uppercase">Easypaisa QR Code Image</label>
              
              <div className="flex items-center gap-4 p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                <img
                  src={editQrUrl}
                  alt="QR Preview"
                  className="w-20 h-20 object-contain rounded-xl border border-slate-700 bg-white p-1 shrink-0"
                />

                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload QR Image File</span>
                  </button>

                  <span className="text-[10px] text-gray-400">Supports PNG, JPG, WEBP or SVG</span>
                </div>
              </div>
            </div>

            {/* Note / Instructions Field */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono font-bold text-gray-300 uppercase">Payment Instructions / Notes</label>
              <textarea
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                rows={3}
                placeholder="e.g. Send payment and keep screenshot receipt..."
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-400 outline-none resize-none"
              />
            </div>

            {/* Save / Cancel Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold text-xs uppercase transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/50 text-gray-400 hover:text-red-300 transition cursor-pointer"
                title="Reset Default"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

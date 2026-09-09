import React, { useState } from 'react';
import { X, Key, Server, Trash2, Check, RefreshCw, AlertCircle, Shield } from 'lucide-react';
import { getTMDBKey, setTMDBKey } from '../services/tmdb';
import { SERVERS } from '../services/servers';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultServer: string;
  onDefaultServerChange: (serverId: string) => void;
  onClearHistory: () => void;
  onClearWatchlist: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  defaultServer,
  onDefaultServerChange,
  onClearHistory,
  onClearWatchlist,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState(getTMDBKey());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSaveKey = () => {
    setTMDBKey(apiKeyInput);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleTestKey = async () => {
    setTestStatus('testing');
    try {
      const res = await fetch(`https://api.themoviedb.org/3/configuration?api_key=${apiKeyInput.trim()}`);
      if (res.ok) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
      }
    } catch {
      setTestStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#080808] border border-white/10 rounded p-4 sm:p-6 shadow-2xl text-white max-h-[92vh] overflow-y-auto touch-scroll">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2.5 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
          aria-label="Close settings"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-white mb-1 flex items-center gap-2 pr-10">
          <Shield className="w-5 h-5 text-yellow-400 shrink-0" /> App & Streaming Preferences
        </h2>
        <p className="text-xs text-white/50 font-medium uppercase tracking-wider mb-5">Configure TMDB API key, default video server, and data storage</p>

        <div className="space-y-4 sm:space-y-6 text-xs">
          {/* TMDB API Key */}
          <div className="bg-white/5 border border-white/10 rounded p-3.5 sm:p-4 space-y-3">
            <label className="font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-yellow-400" /> Custom TMDB API Key
            </label>
            <p className="text-white/50 text-[11px] leading-relaxed font-medium uppercase tracking-wider">
              Optional. CineHD includes a working public TMDB API key by default. You can replace it with your own key from themoviedb.org.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                placeholder="ENTER TMDB V3 API KEY"
                className="flex-1 px-3 py-2 bg-black border border-white/20 rounded-sm text-white font-mono text-[16px] sm:text-xs focus:outline-none focus:border-yellow-400 touch-manipulation"
              />
              <button
                onClick={handleSaveKey}
                className="min-h-[40px] px-4 py-2 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-300 text-black font-black uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-1 touch-manipulation"
              >
                {saveSuccess ? <Check className="w-4 h-4" /> : 'Save'}
              </button>
            </div>
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleTestKey}
                disabled={testStatus === 'testing'}
                className="text-yellow-400 hover:underline flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider min-h-[36px] touch-manipulation"
              >
                <RefreshCw className={`w-3 h-3 ${testStatus === 'testing' ? 'animate-spin' : ''}`} /> Test API Key
              </button>
              {testStatus === 'success' && (
                <span className="text-yellow-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Check className="w-3 h-3" /> API Key Valid
                </span>
              )}
              {testStatus === 'error' && (
                <span className="text-red-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Connection Failed
                </span>
              )}
            </div>
          </div>

          {/* Preferred Default Server */}
          <div className="bg-white/5 border border-white/10 rounded p-3.5 sm:p-4 space-y-2.5">
            <label className="font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-yellow-400" /> Preferred Video Player Server
            </label>
            <select
              value={defaultServer}
              onChange={e => onDefaultServerChange(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 bg-black border border-white/20 rounded-sm text-white text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-yellow-400 touch-manipulation"
            >
              {SERVERS.map(srv => (
                <option key={srv.id} value={srv.id} className="bg-black text-white">
                  {srv.name} - {srv.quality} ({srv.speed})
                </option>
              ))}
            </select>
          </div>

          {/* Local Storage & Cache */}
          <div className="bg-white/5 border border-white/10 rounded p-3.5 sm:p-4 space-y-2.5">
            <span className="font-bold uppercase tracking-wider text-white block">Storage & Watch Data</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={onClearHistory}
                className="min-h-[44px] px-3 py-2.5 bg-white/5 hover:bg-red-500/20 active:bg-red-500/20 border border-white/10 hover:border-red-500 text-white/70 hover:text-red-400 font-bold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-1.5 touch-manipulation"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Watch History
              </button>
              <button
                onClick={onClearWatchlist}
                className="min-h-[44px] px-3 py-2.5 bg-white/5 hover:bg-red-500/20 active:bg-red-500/20 border border-white/10 hover:border-red-500 text-white/70 hover:text-red-400 font-bold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-1.5 touch-manipulation"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Watchlist
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 border border-white/20 hover:border-yellow-400 active:border-yellow-400 text-white font-black uppercase tracking-wider text-xs bg-white/5 touch-manipulation"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};

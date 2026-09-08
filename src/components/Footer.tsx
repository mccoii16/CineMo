import React from 'react';
import { Server, ShieldCheck, Heart, Sparkles, Globe } from 'lucide-react';

interface FooterProps {
  onOpenServerGuide: () => void;
  onOpenSettings: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenServerGuide, onOpenSettings }) => {
  return (
    <footer className="mt-16 bg-[#080808] border-t border-white/10 text-white/60 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-sm bg-yellow-400 text-black font-black text-xl flex items-center justify-center border border-yellow-400">
                C
              </div>
              <span className="text-xl font-black text-white uppercase tracking-tighter">
                CINE<span className="text-yellow-400">HD</span>
              </span>
            </div>
            <p className="text-white/50 text-xs leading-relaxed font-medium uppercase tracking-wider">
              Ultra-fast movie & TV show streaming aggregator client. Enjoy high-definition releases, K-dramas, anime, and live TV channels with multi-server playback.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white/50 block mb-2">Server Network</span>
            <ul className="space-y-1.5 text-[11px] font-bold uppercase tracking-wider">
              <li>
                <button onClick={onOpenServerGuide} className="hover:text-yellow-400 transition-colors flex items-center gap-1.5 text-white/70">
                  <Server className="w-3 h-3 text-yellow-400" /> Server 1 (VidSrc Pro)
                </button>
              </li>
              <li>
                <button onClick={onOpenServerGuide} className="hover:text-yellow-400 transition-colors flex items-center gap-1.5 text-white/70">
                  <Server className="w-3 h-3 text-yellow-400" /> Server 2 (VidLink Ultra)
                </button>
              </li>
              <li>
                <button onClick={onOpenServerGuide} className="hover:text-yellow-400 transition-colors flex items-center gap-1.5 text-white/70">
                  <Server className="w-3 h-3 text-yellow-400" /> Server 3 (EmbedSu HD)
                </button>
              </li>
              <li>
                <button onClick={onOpenServerGuide} className="hover:text-yellow-400 transition-colors flex items-center gap-1.5 text-white/70">
                  <Server className="w-3 h-3 text-yellow-400" /> Server 4 (AutoEmbed VIP)
                </button>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white/50 block mb-2">Capabilities</span>
            <ul className="space-y-1.5 text-[11px] font-bold uppercase tracking-wider">
              <li className="flex items-center gap-1.5 text-white/70">
                <ShieldCheck className="w-3 h-3 text-yellow-400" /> 4K & 1080p Stream Quality
              </li>
              <li className="flex items-center gap-1.5 text-white/70">
                <Sparkles className="w-3 h-3 text-yellow-400" /> Subtitles in 30+ Languages
              </li>
              <li className="flex items-center gap-1.5 text-white/70">
                <Globe className="w-3 h-3 text-yellow-400" /> Asian Dramas & Anime Vault
              </li>
              <li>
                <button onClick={onOpenSettings} className="hover:text-yellow-400 transition-colors text-white/70">
                  Custom TMDB API Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Disclaimer */}
          <div className="space-y-2 text-[11px] leading-relaxed text-white/40 font-medium uppercase tracking-wider">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white/50 block mb-2">Disclaimer</span>
            <p>
              CineHD does not store or host any video media files on its own servers. All content is dynamically embedded via external non-affiliated third-party streaming sources using public metadata indexes.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/40 font-bold uppercase tracking-wider gap-2">
          <span>© 2026 CineHD Pro Ultra. Multi-Server Movie & TV Client.</span>
          <span className="flex items-center gap-1 text-white/60">
            Powered by <strong className="text-yellow-400">TMDB API & Multi-Server Embed CDN</strong>
          </span>
        </div>
      </div>
    </footer>
  );
};

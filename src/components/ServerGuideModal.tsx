import React from 'react';
import { X, Server, ShieldCheck, Zap, Info, CheckCircle2, HelpCircle } from 'lucide-react';
import { SERVERS } from '../services/servers';

interface ServerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ServerGuideModal: React.FC<ServerGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#080808] border border-white/10 rounded p-6 shadow-2xl my-8 text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-yellow-400 text-black font-black border border-yellow-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">CineHD Streaming Servers & Architecture</h2>
            <p className="text-xs text-white/50 font-medium uppercase tracking-wider">How CineHD streams movies & TV series across multiple global CDN nodes</p>
          </div>
        </div>

        <div className="space-y-5 text-xs">
          <div className="bg-white/5 border border-white/10 rounded p-4 flex items-start space-x-3">
            <ShieldCheck className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-black uppercase tracking-wider text-yellow-400">Yes! You Have Access to All Major CineHD Servers</h4>
              <p className="text-white/80 text-xs mt-1 leading-relaxed font-medium uppercase tracking-wide">
                Just like <span className="text-yellow-400 font-black">CineHD.app</span>, this application functions as a high-performance content aggregator. It dynamically connects to the exact same stream distribution servers using <span className="text-yellow-400 font-bold">TMDB (The Movie Database)</span> identifiers.
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded p-4 space-y-3">
            <h3 className="font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" /> Integrated Streaming Servers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {SERVERS.map(server => (
                <div key={server.id} className="p-2.5 bg-[#080808] border border-white/10 rounded flex items-center justify-between">
                  <div>
                    <span className="font-bold uppercase text-white block">{server.name}</span>
                    <span className="text-white/50 text-[11px] font-medium">{server.description}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-sm bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest shrink-0 ml-2">
                    {server.speed}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded p-4 space-y-2">
            <h3 className="font-black uppercase tracking-wider text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-yellow-400" /> How It Works Under The Hood
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-white/70 text-xs leading-relaxed font-medium uppercase tracking-wide">
              <li><strong className="text-white font-black">TMDB Metadata:</strong> Content details (posters, cast, seasons, episode numbers) are retrieved directly from The Movie Database API.</li>
              <li><strong className="text-white font-black">Dynamic Stream Resolver:</strong> When you hit play, the selected server receives the TMDB ID (or Season/Episode numbers for TV shows) and serves the video stream.</li>
              <li><strong className="text-white font-black">Instant Server Switcher:</strong> If a stream buffers or is blocked, switch to Server 2 (VidLink Ultra), Server 3 (VidSrc TO), Server 4 (VidSrc Net), or Server 5 (RiveStream) with a single click.</li>
            </ol>
          </div>

          <div className="bg-yellow-400/10 border border-yellow-400/30 rounded p-4 flex items-start space-x-3 text-xs text-white/80">
            <Info className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-black uppercase tracking-wider text-yellow-400 block mb-0.5">Pro Tip for Smooth Playback:</span>
              If an embedded video displays an error or fails to load, simply click another server pill in the video player header (e.g. Server 2 VidLink Ultra or Server 3 VidSrc TO).
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase tracking-wider text-xs border border-yellow-400 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Got It, Start Streaming
          </button>
        </div>
      </div>
    </div>
  );
};

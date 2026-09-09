import React, { useState } from 'react';
import { Radio, Play, Shield, Globe, Tv, RefreshCw } from 'lucide-react';
import { LiveChannel } from '../types';
import { LIVE_CHANNELS } from '../services/livetv';

export const LiveTvView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeChannel, setActiveChannel] = useState<LiveChannel>(LIVE_CHANNELS[0]);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const categories = ['All', 'Sports', 'News', 'Movies', 'Anime', 'Entertainment', 'Kids'];

  const filteredChannels = LIVE_CHANNELS.filter(ch => {
    if (selectedCategory === 'All') return true;
    return ch.category === selectedCategory;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Live Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 border border-white/10 p-3.5 sm:p-4 rounded">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 sm:p-3 bg-red-600/20 border border-red-500/40 rounded text-red-500 animate-pulse shrink-0">
            <Radio className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-xl md:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              CineHD Live TV & Sports Hub
            </h1>
            <p className="text-[11px] sm:text-xs text-white/50 font-medium uppercase tracking-wider">24/7 Live Broadcasts • Sports • News</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-red-600 text-white border border-red-500 rounded-sm text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white"></span> LIVE BROADCAST
          </span>
        </div>
      </div>

      {/* Main Live Player */}
      <div className="bg-white/5 border border-white/10 rounded overflow-hidden p-3 sm:p-4 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 pr-2">
            <img src={activeChannel.logo} alt={activeChannel.name} className="w-9 h-9 sm:w-10 sm:h-10 rounded-sm object-cover border border-white/20 shrink-0" />
            <div className="min-w-0">
              <h2 className="text-xs sm:text-base font-black uppercase tracking-tight text-white truncate">
                {activeChannel.name}
              </h2>
              <p className="text-[10px] sm:text-xs text-yellow-400 font-extrabold uppercase tracking-wider truncate">Now Airing: {activeChannel.currentProgram}</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <span className="text-[10px] sm:text-xs text-white/50 font-bold uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="hidden xs:inline">{activeChannel.country}</span>
            </span>
            <button
              onClick={() => setReloadKey(prev => prev + 1)}
              className="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center bg-white/5 border border-white/10 hover:border-yellow-400 active:border-yellow-400 text-white/80 hover:text-yellow-400 rounded text-xs transition-colors touch-manipulation"
              title="Refresh Stream"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Player Window */}
        <div className="relative aspect-video w-full rounded overflow-hidden bg-black border border-white/10 shadow-2xl">
          <iframe
            key={`${activeChannel.id}-${reloadKey}`}
            src={activeChannel.streamUrl}
            title={activeChannel.name}
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
      </div>

      {/* Channel Categories & Selector */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full touch-scroll no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[38px] px-3.5 sm:px-4 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all shrink-0 touch-manipulation ${
                selectedCategory === cat
                  ? 'bg-yellow-400 text-black border border-yellow-400'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:border-yellow-400/50 hover:text-yellow-400 active:border-yellow-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
          {filteredChannels.map(ch => {
            const isSelected = ch.id === activeChannel.id;

            return (
              <div
                key={ch.id}
                onClick={() => setActiveChannel(ch)}
                className={`flex items-center justify-between p-2.5 sm:p-3 rounded border cursor-pointer transition-all touch-manipulation active:scale-[0.98] ${
                  isSelected
                    ? 'bg-yellow-400/10 border-yellow-400'
                    : 'bg-[#080808] border-white/10 hover:border-yellow-400/60'
                }`}
              >
                <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 pr-2">
                  <img src={ch.logo} alt={ch.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm object-cover shrink-0 border border-white/10" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-black uppercase text-white truncate">{ch.name}</h4>
                    <p className="text-[10px] sm:text-[11px] text-yellow-400 font-bold truncate mt-0.5 uppercase tracking-wider">{ch.currentProgram}</p>
                    <span className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-widest font-black">{ch.category}</span>
                  </div>
                </div>

                <div className={`p-2 shrink-0 font-black rounded-sm ${isSelected ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white'}`}>
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

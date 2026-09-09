import React from 'react';
import { Play, Film, Tv, Radio, Bookmark, Sparkles } from 'lucide-react';
import { ContentType } from '../types';

interface MobileBottomNavProps {
  activeTab: ContentType | 'home' | 'watchlist';
  onTabChange: (tab: ContentType | 'home' | 'watchlist') => void;
  watchlistCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  watchlistCount,
}) => {
  const navItems: { id: ContentType | 'home' | 'watchlist'; label: string; icon: React.FC<{ className?: string }>; badge?: number; isLive?: boolean }[] = [
    { id: 'home', label: 'Home', icon: Play },
    { id: 'movie', label: 'Movies', icon: Film },
    { id: 'tv', label: 'TV Shows', icon: Tv },
    { id: 'kdrama', label: 'Dramas', icon: Sparkles },
    { id: 'livetv', label: 'Live TV', icon: Radio, isLive: true },
    { id: 'watchlist', label: 'My List', icon: Bookmark, badge: watchlistCount },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#080808]/95 backdrop-blur-xl border-t border-white/10 pb-safe md:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.8)]"
    >
      <div className="flex items-center justify-around h-16 px-1 max-w-lg mx-auto">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex-1 flex flex-col items-center justify-center h-full py-1 px-0.5 transition-all touch-manipulation select-none active:scale-90 ${
                isActive
                  ? 'text-yellow-400 font-extrabold'
                  : 'text-white/60 hover:text-white font-medium'
              }`}
            >
              <div className="relative mb-1">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'
                  }`}
                />
                {item.isLive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-600 animate-pulse border border-[#080808]"></span>
                )}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 px-1 min-w-[15px] h-[15px] flex items-center justify-center rounded-full bg-yellow-400 text-black text-[9px] font-black leading-none shadow-sm">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight uppercase transition-all truncate max-w-[56px] text-center ${
                  isActive ? 'text-yellow-400 font-black' : 'text-white/60'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)]"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

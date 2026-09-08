import React, { useState } from 'react';
import { Search, Server, Settings, Bookmark, Tv, Film, Play, Menu, X, Sparkles, HelpCircle } from 'lucide-react';
import { ContentType } from '../types';

interface NavbarProps {
  activeTab: ContentType | 'home' | 'watchlist';
  onTabChange: (tab: ContentType | 'home' | 'watchlist') => void;
  onOpenSearch: () => void;
  onOpenServerGuide: () => void;
  onOpenSettings: () => void;
  watchlistCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenSearch,
  onOpenServerGuide,
  onOpenSettings,
  watchlistCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Play },
    { id: 'movie', label: 'Movies', icon: Film },
    { id: 'tv', label: 'TV Shows', icon: Tv },
    { id: 'kdrama', label: 'Asian Dramas', icon: Sparkles },
    { id: 'anime', label: 'Anime', icon: Sparkles },
    { id: 'livetv', label: 'Live TV', icon: Tv },
    { id: 'watchlist', label: 'My List', icon: Bookmark, badge: watchlistCount },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#080808]/85 backdrop-blur-md border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div
            onClick={() => onTabChange('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <span className="text-2xl md:text-3xl font-black tracking-tighter italic text-yellow-400 group-hover:scale-105 transition-transform">
              CINE<span className="text-white">HD</span>
            </span>
            <span className="px-2 py-0.5 rounded-sm bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest">
              PRO
            </span>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id as any)}
                  className={`relative px-3.5 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                    isActive
                      ? 'text-yellow-400 bg-white/10 border border-yellow-400/50'
                      : 'text-white/70 hover:text-yellow-400 hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded bg-yellow-400 text-black text-[10px] font-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Utilities */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenSearch}
              className="px-3.5 py-2 rounded bg-white/10 hover:bg-white/15 border border-white/10 text-white hover:border-yellow-400/50 transition-colors text-xs font-medium flex items-center gap-2"
              title="Search Media"
            >
              <Search className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden sm:inline text-white/70">Search movies...</span>
            </button>

            <button
              onClick={onOpenServerGuide}
              className="server-pill px-3.5 py-2 rounded text-xs font-bold uppercase flex items-center gap-1.5"
              title="Server Info & Status"
            >
              <Server className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden md:inline">Servers</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="p-2 rounded bg-white/5 border border-white/10 text-white/70 hover:text-yellow-400 hover:border-yellow-400/50 transition-colors"
              title="App Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded bg-white/10 border border-white/10 text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#080808] border-b border-white/10 px-4 py-4 space-y-2 animate-fadeIn">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded text-xs font-extrabold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-yellow-400 text-black shadow-md'
                    : 'text-white/80 bg-white/5 hover:bg-white/10 border border-white/5'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded bg-black text-yellow-400 text-[10px] font-black">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

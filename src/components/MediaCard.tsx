import React from 'react';
import { Play, Bookmark, Star, Film, Tv } from 'lucide-react';
import { MediaItem } from '../types';
import { getImageUrl } from '../services/tmdb';

interface MediaCardProps {
  item: MediaItem;
  onSelect: (item: MediaItem) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (item: MediaItem, e: React.MouseEvent) => void;
  watchProgress?: number; // 0-100
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  onSelect,
  isBookmarked = false,
  onToggleBookmark,
  watchProgress,
}) => {
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);

  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative flex flex-col bg-white/5 border border-white/10 overflow-hidden cursor-pointer hover:border-yellow-400/80 active:scale-[0.98] transition-all duration-200 touch-manipulation select-none"
    >
      {/* Poster Image & Overlay */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#080808]">
        <img
          src={getImageUrl(item.poster_path)}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-300"
        />

        {/* Top Badges */}
        <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
          <span className="px-1.5 py-0.5 bg-yellow-400 text-black text-[9px] font-black uppercase tracking-widest rounded-sm">
            {item.quality || 'HD'}
          </span>

          <div className="flex items-center space-x-1 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm text-[10px] font-extrabold text-yellow-400 border border-white/10 rounded-sm">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400" />
            <span>{item.vote_average || '8.0'}</span>
          </div>
        </div>

        {/* Mobile-only Direct Bookmark Button */}
        {onToggleBookmark && (
          <button
            onClick={e => {
              e.stopPropagation();
              onToggleBookmark(item, e);
            }}
            aria-label={isBookmarked ? 'Remove from My List' : 'Add to My List'}
            className={`sm:hidden absolute bottom-1.5 right-1.5 p-2 rounded-full border shadow-md z-10 transition-transform active:scale-90 touch-manipulation ${
              isBookmarked
                ? 'bg-red-600 text-white border-red-500'
                : 'bg-black/80 backdrop-blur-md text-white/80 border-white/20'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Desktop Hover Quick Action Overlay */}
        <div className="hidden sm:flex absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center justify-center gap-3">
          <div className="p-3 bg-white text-black font-black rounded-none shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-current" />
          </div>

          {onToggleBookmark && (
            <button
              onClick={e => {
                e.stopPropagation();
                onToggleBookmark(item, e);
              }}
              className={`p-2.5 border transition-colors ${
                isBookmarked
                  ? 'bg-red-600 text-white border-red-500'
                  : 'bg-black text-white border-white/20 hover:border-yellow-400 hover:text-yellow-400'
              }`}
              title={isBookmarked ? 'Remove from My List' : 'Add to My List'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Watch Progress Bar if available */}
        {watchProgress !== undefined && watchProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div
              className="h-full bg-yellow-400"
              style={{ width: `${Math.min(100, Math.max(0, watchProgress))}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="p-3 flex flex-col justify-between flex-1 bg-[#080808]">
        <h3 className="text-xs font-bold uppercase truncate tracking-tight text-white group-hover:text-yellow-400 transition-colors">
          {item.title}
        </h3>
        <div className="flex items-center justify-between text-[10px] font-medium opacity-50 uppercase tracking-wider mt-1.5">
          <span className="flex items-center gap-1 font-bold">
            {item.media_type === 'movie' ? (
              <Film className="w-3 h-3 text-yellow-400" />
            ) : (
              <Tv className="w-3 h-3 text-yellow-400" />
            )}
            {item.media_type}
          </span>
          {year && <span>{year}</span>}
        </div>
      </div>
    </div>
  );
};

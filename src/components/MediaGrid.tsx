import React from 'react';
import { MediaItem } from '../types';
import { MediaCard } from './MediaCard';
import { GENRES } from '../services/tmdb';

interface MediaGridProps {
  title: string;
  subtitle?: string;
  items: MediaItem[];
  onSelectMedia: (item: MediaItem) => void;
  watchlistIds: number[];
  onToggleBookmark: (item: MediaItem, e: React.MouseEvent) => void;
  selectedGenreId?: number;
  onGenreSelect?: (genreId: number | undefined) => void;
  genreList?: number[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  title,
  subtitle,
  items,
  onSelectMedia,
  watchlistIds,
  onToggleBookmark,
  selectedGenreId,
  onGenreSelect,
  genreList,
  onLoadMore,
  hasMore = false,
  loading = false,
}) => {
  return (
    <section className="space-y-4 my-8">
      {/* Title Header & Genre Chips */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 block mb-0.5">
            CineHD Collection
          </span>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-yellow-400 inline-block"></span>
            {title}
          </h2>
          {subtitle && <p className="text-xs text-white/60 font-medium mt-0.5">{subtitle}</p>}
        </div>

        {/* Genre Pills */}
        {genreList && onGenreSelect && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full touch-scroll no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => onGenreSelect(undefined)}
              className={`px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all touch-manipulation min-h-[36px] ${
                selectedGenreId === undefined
                  ? 'bg-yellow-400 text-black font-black border border-yellow-400'
                  : 'bg-white/5 text-white/70 hover:text-yellow-400 border border-white/10 hover:border-yellow-400/50'
              }`}
            >
              All Genres
            </button>
            {genreList.map(gId => (
              <button
                key={gId}
                onClick={() => onGenreSelect(gId)}
                className={`px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all touch-manipulation min-h-[36px] ${
                  selectedGenreId === gId
                    ? 'bg-yellow-400 text-black font-black border border-yellow-400'
                    : 'bg-white/5 text-white/70 hover:text-yellow-400 border border-white/10 hover:border-yellow-400/50'
                }`}
              >
                {GENRES[gId] || `Genre ${gId}`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid Cards */}
      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3 md:gap-4">
          {items.map(item => (
            <MediaCard
              key={`${item.media_type}-${item.id}`}
              item={item}
              onSelect={onSelectMedia}
              isBookmarked={watchlistIds.includes(item.id)}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center bg-white/5 border border-white/10 rounded">
          <p className="text-white/50 text-xs font-bold uppercase tracking-wider">No media titles found for this filter selection.</p>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && onLoadMore && (
        <div className="pt-4 text-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="w-full sm:w-auto min-h-[44px] px-8 py-3 border-2 border-white/20 hover:border-yellow-400 hover:text-yellow-400 active:border-yellow-400 active:text-yellow-400 bg-white/5 text-white font-black uppercase tracking-wider text-xs transition-all touch-manipulation"
          >
            {loading ? 'Loading More Releases...' : 'Explore More Releases'}
          </button>
        </div>
      )}
    </section>
  );
};

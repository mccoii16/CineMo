import React, { useState, useEffect } from 'react';
import { Search, X, Star, Film, Tv, Play } from 'lucide-react';
import { MediaItem, ContentType } from '../types';
import { searchMedia, getImageUrl } from '../services/tmdb';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (item: MediaItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectMedia }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'movie' | 'tv'>('all');

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await searchMedia(query);
      setResults(res);
      setLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const filteredResults = results.filter(item => {
    if (activeFilter === 'all') return true;
    return item.media_type === activeFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-3 sm:pt-16 md:pt-24 bg-black/90 backdrop-blur-md p-2 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#080808] border border-white/10 rounded p-3 sm:p-4 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]">
        {/* Search Header Input */}
        <div className="relative flex items-center border-b border-white/10 pb-3">
          <Search className="w-5 h-5 text-yellow-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search movies, TV series, anime, dramas..."
            className="w-full pl-10 pr-10 py-2.5 sm:py-2.5 bg-white/5 border border-white/10 rounded text-white text-[16px] sm:text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-yellow-400 placeholder:text-white/40 placeholder:font-medium touch-manipulation"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-12 p-2 text-white/50 hover:text-white min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 p-2.5 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 my-2.5 px-0.5 text-xs overflow-x-auto touch-scroll no-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded text-xs font-extrabold uppercase tracking-wider transition-all shrink-0 touch-manipulation ${
              activeFilter === 'all'
                ? 'bg-yellow-400 text-black border border-yellow-400'
                : 'bg-white/5 text-white/70 hover:text-yellow-400 border border-white/10'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setActiveFilter('movie')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded text-xs font-extrabold uppercase tracking-wider transition-all shrink-0 touch-manipulation ${
              activeFilter === 'movie'
                ? 'bg-yellow-400 text-black border border-yellow-400'
                : 'bg-white/5 text-white/70 hover:text-yellow-400 border border-white/10'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => setActiveFilter('tv')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded text-xs font-extrabold uppercase tracking-wider transition-all shrink-0 touch-manipulation ${
              activeFilter === 'tv'
                ? 'bg-yellow-400 text-black border border-yellow-400'
                : 'bg-white/5 text-white/70 hover:text-yellow-400 border border-white/10'
            }`}
          >
            TV Series
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 touch-scroll custom-scrollbar">
          {loading && (
            <div className="py-12 text-center text-white/50 text-xs font-bold uppercase tracking-wider flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Searching content databases...</span>
            </div>
          )}

          {!loading && query && filteredResults.length === 0 && (
            <div className="py-12 text-center text-white/50 text-xs font-bold uppercase tracking-wider">
              No content found matching "{query}". Try checking spelling or search another keyword.
            </div>
          )}

          {!loading && filteredResults.map(item => (
            <div
              key={`${item.media_type}-${item.id}`}
              onClick={() => {
                onSelectMedia(item);
                onClose();
              }}
              className="flex items-center justify-between p-2.5 rounded bg-white/5 hover:bg-white/10 active:scale-[0.99] border border-white/10 hover:border-yellow-400/60 cursor-pointer group transition-all touch-manipulation select-none"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1 mr-2">
                <img
                  src={getImageUrl(item.poster_path)}
                  alt={item.title}
                  className="w-11 h-16 object-cover rounded-sm shrink-0 shadow-md group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold uppercase text-white group-hover:text-yellow-400 truncate">
                    {item.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-medium opacity-60 uppercase tracking-wider text-white mt-1">
                    <span className="uppercase px-1.5 py-0.5 bg-yellow-400 text-black font-black rounded-sm flex items-center gap-1">
                      {item.media_type === 'movie' ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                      {item.media_type}
                    </span>
                    <span>{(item.release_date || item.first_air_date || '').slice(0, 4)}</span>
                    <span className="flex items-center text-yellow-400 font-extrabold gap-0.5">
                      <Star className="w-3 h-3 fill-yellow-400" /> {item.vote_average}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-white text-black font-black group-hover:bg-yellow-400 rounded-none transition-all shrink-0">
                <Play className="w-4 h-4 fill-current" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

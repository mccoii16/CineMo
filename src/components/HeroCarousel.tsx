import React, { useState, useEffect } from 'react';
import { Play, Bookmark, Star, Film, Tv, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '../types';
import { getImageUrl } from '../services/tmdb';

interface HeroCarouselProps {
  items: MediaItem[];
  onSelectMedia: (item: MediaItem) => void;
  watchlistIds: number[];
  onToggleBookmark: (item: MediaItem, e: React.MouseEvent) => void;
  onOpenTrailer: (item: MediaItem) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  items,
  onSelectMedia,
  watchlistIds,
  onToggleBookmark,
  onOpenTrailer,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStartHandler = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMoveHandler = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [items]);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];
  const isBookmarked = watchlistIds.includes(currentItem.id);
  const year = (currentItem.release_date || currentItem.first_air_date || '').slice(0, 4);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
  };

  return (
    <div
      onTouchStart={onTouchStartHandler}
      onTouchMove={onTouchMoveHandler}
      onTouchEnd={onTouchEndHandler}
      className="relative w-full h-[52vh] min-h-[400px] sm:min-h-[480px] md:h-[65vh] md:max-h-[620px] rounded-none overflow-hidden border border-white/10 my-2 sm:my-4 bg-[#080808] group select-none touch-pan-y"
    >
      {/* Backdrop Image */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl(currentItem.backdrop_path, 'original')}
          alt={currentItem.title}
          className="w-full h-full object-cover object-center transition-all duration-700 filter brightness-75 opacity-60"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/75 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/80 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col justify-end p-4 sm:p-8 md:p-12 max-w-3xl">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          <span className="px-2 py-0.5 bg-yellow-400 text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-sm">
            Featured #{currentIndex + 1}
          </span>
          <span className="px-1.5 sm:px-2 py-0.5 rounded-sm bg-white/10 border border-white/20 text-yellow-400 text-[10px] sm:text-[11px] font-bold uppercase flex items-center gap-1">
            <Star className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-yellow-400" /> {currentItem.vote_average || '8.2'}
          </span>
          <span className="px-1.5 sm:px-2 py-0.5 rounded-sm bg-white/10 border border-white/10 text-white/80 text-[10px] sm:text-[11px] font-bold uppercase flex items-center gap-1">
            {currentItem.media_type === 'movie' ? <Film className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-yellow-400" /> : <Tv className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-yellow-400" />}
            {currentItem.media_type}
          </span>
          {year && <span className="text-white/60 text-[11px] sm:text-xs font-bold uppercase tracking-wider">{year}</span>}
          <span className="px-1.5 sm:px-2 py-0.5 rounded-sm bg-red-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
            {currentItem.quality || '4K ULTRA'}
          </span>
        </div>

        {/* Title */}
        <h1 className="movie-title text-white mb-1.5 sm:mb-2 drop-shadow-lg uppercase text-2xl sm:text-4xl md:text-5xl line-clamp-2">
          {currentItem.title}
        </h1>

        {currentItem.tagline && (
          <p className="text-yellow-400 text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-wider mb-1.5 sm:mb-2 line-clamp-1">
            "{currentItem.tagline}"
          </p>
        )}

        {/* Synopsis */}
        <p className="text-white/70 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 leading-relaxed font-medium mb-4 sm:mb-6 max-w-xl">
          {currentItem.overview}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => onSelectMedia(currentItem)}
            className="flex-1 sm:flex-initial min-h-[44px] bg-white text-black hover:bg-yellow-400 active:bg-yellow-400 font-black uppercase tracking-tighter text-xs sm:text-sm md:text-base px-5 sm:px-8 md:px-10 py-3 flex items-center justify-center gap-2 transition-all rounded-sm touch-manipulation"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> Watch Now
          </button>

          <button
            onClick={() => onOpenTrailer(currentItem)}
            className="min-h-[44px] border-2 border-white/20 hover:border-yellow-400 hover:text-yellow-400 active:border-yellow-400 active:text-yellow-400 text-white font-black uppercase tracking-tighter text-xs sm:text-sm md:text-base px-4 sm:px-6 py-3 backdrop-blur-sm transition-all flex items-center justify-center gap-1.5 rounded-sm touch-manipulation"
          >
            <Info className="w-4 h-4 text-yellow-400" /> Trailer
          </button>

          <button
            onClick={e => onToggleBookmark(currentItem, e)}
            className={`min-h-[44px] min-w-[44px] p-3 border-2 transition-all rounded-sm flex items-center justify-center touch-manipulation ${
              isBookmarked
                ? 'bg-red-600 text-white border-red-500'
                : 'border-white/20 text-white hover:border-yellow-400 hover:text-yellow-400 active:border-yellow-400 bg-white/5'
            }`}
            title={isBookmarked ? 'In My List' : 'Add to My List'}
          >
            <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 p-3 bg-black/70 hover:bg-yellow-400 hover:text-black text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Slide"
        className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-black/70 hover:bg-yellow-400 hover:text-black text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6 flex items-center space-x-1.5 z-20">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-1.5 transition-all rounded-full p-1 -m-1 touch-manipulation ${
              idx === currentIndex ? 'w-6 sm:w-8 bg-yellow-400' : 'w-2 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { ContentType, MediaItem, WatchHistoryItem } from './types';
import {
  fetchTrending,
  fetchPopularMovies,
  fetchPopularTVShows,
  fetchAsianDramas,
  fetchAnime,
  fetchTrailerKey,
} from './services/tmdb';
import { SERVERS } from './services/servers';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { MediaGrid } from './components/MediaGrid';
import { PlayerView } from './components/PlayerView';
import { LiveTvView } from './components/LiveTvView';
import { WatchlistView } from './components/WatchlistView';
import { SearchModal } from './components/SearchModal';
import { ServerGuideModal } from './components/ServerGuideModal';
import { SettingsModal } from './components/SettingsModal';
import { TrailerModal } from './components/TrailerModal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<ContentType | 'home' | 'watchlist'>('home');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // Content Data
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [tvShows, setTvShows] = useState<MediaItem[]>([]);
  const [kdramas, setKdramas] = useState<MediaItem[]>([]);
  const [anime, setAnime] = useState<MediaItem[]>([]);

  // Filtering & Pagination
  const [selectedGenreId, setSelectedGenreId] = useState<number | undefined>(undefined);
  const [moviePage, setMoviePage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // Modals
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [serverGuideOpen, setServerGuideOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [trailerData, setTrailerData] = useState<{ key: string; title: string } | null>(null);

  // LocalStorage Persisted State
  const [watchlist, setWatchlist] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem('cinehd_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('cinehd_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [defaultServer, setDefaultServer] = useState<string>(() => {
    const saved = localStorage.getItem('cinehd_default_server');
    if (saved && SERVERS.some(s => s.id === saved)) {
      return saved;
    }
    return SERVERS[0].id;
  });

  // Save watchlist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('cinehd_watchlist', JSON.stringify(watchlist));
    } catch (e) {
      console.warn('Watchlist save error:', e);
    }
  }, [watchlist]);

  // Save history to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('cinehd_history', JSON.stringify(watchHistory));
    } catch (e) {
      console.warn('History save error:', e);
    }
  }, [watchHistory]);

  // Save default server to LocalStorage
  useEffect(() => {
    localStorage.setItem('cinehd_default_server', defaultServer);
  }, [defaultServer]);

  // Initial Content Load
  useEffect(() => {
    let isMounted = true;

    fetchTrending('all').then(res => isMounted && setTrending(res));
    fetchPopularMovies(1).then(res => isMounted && setMovies(res));
    fetchPopularTVShows(1).then(res => isMounted && setTvShows(res));
    fetchAsianDramas(1).then(res => isMounted && setKdramas(res));
    fetchAnime(1).then(res => isMounted && setAnime(res));

    return () => {
      isMounted = false;
    };
  }, []);

  const watchlistIds = watchlist.map(item => item.id);

  const handleToggleBookmark = useCallback(
    (item: MediaItem, e: React.MouseEvent) => {
      e.stopPropagation();
      setWatchlist(prev => {
        const exists = prev.some(x => x.id === item.id);
        if (exists) {
          return prev.filter(x => x.id !== item.id);
        } else {
          return [item, ...prev];
        }
      });
    },
    []
  );

  const handleOpenTrailer = useCallback(async (item: MediaItem) => {
    const key = await fetchTrailerKey(item.id, item.media_type);
    if (key) {
      setTrailerData({ key, title: item.title });
    } else {
      alert(`No official YouTube trailer found for "${item.title}".`);
    }
  }, []);

  const handleSelectMedia = (item: MediaItem) => {
    setSelectedMedia(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update history
    setWatchHistory(prev => {
      const filtered = prev.filter(x => x.id !== item.id);
      const newItem: WatchHistoryItem = {
        id: item.id,
        media_type: item.media_type,
        title: item.title,
        poster_path: item.poster_path,
        progressPercent: 10,
        lastWatchedAt: Date.now(),
      };
      return [newItem, ...filtered];
    });
  };

  const handleUpdateHistoryProgress = (season?: number, episode?: number, episodeTitle?: string) => {
    if (!selectedMedia) return;
    setWatchHistory(prev => {
      const filtered = prev.filter(x => x.id !== selectedMedia.id);
      const updatedItem: WatchHistoryItem = {
        id: selectedMedia.id,
        media_type: selectedMedia.media_type,
        title: selectedMedia.title,
        poster_path: selectedMedia.poster_path,
        season,
        episode,
        episodeTitle,
        progressPercent: 35,
        lastWatchedAt: Date.now(),
      };
      return [updatedItem, ...filtered];
    });
  };

  const handleLoadMoreMovies = async () => {
    setLoadingMore(true);
    const nextPage = moviePage + 1;
    const newItems = await fetchPopularMovies(nextPage);
    setMovies(prev => [...prev, ...newItems]);
    setMoviePage(nextPage);
    setLoadingMore(false);
  };

  const handleClearWatchlist = () => {
    if (confirm('Are you sure you want to clear your saved list?')) {
      setWatchlist([]);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your watch history?')) {
      setWatchHistory([]);
    }
  };

  // Filter items by selected genre if any
  const filterByGenre = (items: MediaItem[]) => {
    if (!selectedGenreId) return items;
    return items.filter(x => x.genre_ids && x.genre_ids.includes(selectedGenreId));
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans selection:bg-yellow-400 selection:text-black">
      {/* Top Sticky Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={tab => {
          setActiveTab(tab);
          setSelectedMedia(null);
          setSelectedGenreId(undefined);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        watchlistCount={watchlist.length}
      />

      {/* Main App Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* If PlayerView is active, prioritize player */}
        {selectedMedia ? (
          <PlayerView
            media={selectedMedia}
            onBack={() => setSelectedMedia(null)}
            defaultServerId={defaultServer}
            isBookmarked={watchlistIds.includes(selectedMedia.id)}
            onToggleBookmark={handleToggleBookmark}
            onSelectMedia={handleSelectMedia}
            onOpenTrailer={handleOpenTrailer}
            onUpdateHistory={handleUpdateHistoryProgress}
          />
        ) : (
          <>
            {/* HOME VIEW */}
            {activeTab === 'home' && (
              <div className="space-y-8 animate-fadeIn">
                {/* Hero Featured Carousel */}
                <HeroCarousel
                  items={trending.slice(0, 6)}
                  onSelectMedia={handleSelectMedia}
                  watchlistIds={watchlistIds}
                  onToggleBookmark={handleToggleBookmark}
                  onOpenTrailer={handleOpenTrailer}
                />

                {/* Trending Movies Grid */}
                <MediaGrid
                  title="Trending Movies & Blockbusters"
                  subtitle="Top releases streamed across CineHD global servers"
                  items={movies.slice(0, 12)}
                  onSelectMedia={handleSelectMedia}
                  watchlistIds={watchlistIds}
                  onToggleBookmark={handleToggleBookmark}
                />

                {/* Popular TV Shows Grid */}
                <MediaGrid
                  title="Popular TV Series"
                  subtitle="Binge-worthy shows with multi-season episode browser"
                  items={tvShows.slice(0, 12)}
                  onSelectMedia={handleSelectMedia}
                  watchlistIds={watchlistIds}
                  onToggleBookmark={handleToggleBookmark}
                />

                {/* Asian Dramas & K-Dramas */}
                <MediaGrid
                  title="Asian Dramas & K-Dramas"
                  subtitle="Top rating Korean, Japanese, and Chinese serials"
                  items={kdramas.slice(0, 12)}
                  onSelectMedia={handleSelectMedia}
                  watchlistIds={watchlistIds}
                  onToggleBookmark={handleToggleBookmark}
                />

                {/* Anime Series */}
                <MediaGrid
                  title="Anime Vault"
                  subtitle="Shonen, Isekai, and classic Japanese animated series"
                  items={anime.slice(0, 12)}
                  onSelectMedia={handleSelectMedia}
                  watchlistIds={watchlistIds}
                  onToggleBookmark={handleToggleBookmark}
                />
              </div>
            )}

            {/* MOVIES TAB */}
            {activeTab === 'movie' && (
              <div className="animate-fadeIn">
                <MediaGrid
                  title="Movies Directory"
                  subtitle="Explore thousands of feature films across genres"
                  items={filterByGenre(movies)}
                  onSelectMedia={handleSelectMedia}
                  watchlistIds={watchlistIds}
                  onToggleBookmark={handleToggleBookmark}
                  selectedGenreId={selectedGenreId}
                  onGenreSelect={setSelectedGenreId}
                  genreList={[28, 12, 16, 35, 80, 18, 14, 27, 878, 53]}
                  onLoadMore={handleLoadMoreMovies}
                  hasMore={true}
                  loading={loadingMore}
                />
              </div>
            )}

            {/* TV SHOWS TAB */}
            {activeTab === 'tv' && (
              <div className="animate-fadeIn">
                <MediaGrid
                  title="TV Shows & Serials"
                  subtitle="Stream full seasons and episodes with instant server switching"
                  items={filterByGenre(tvShows)}
                  onSelectMedia={handleSelectMedia}
                  watchlistIds={watchlistIds}
                  onToggleBookmark={handleToggleBookmark}
                  selectedGenreId={selectedGenreId}
                  onGenreSelect={setSelectedGenreId}
                  genreList={[10759, 18, 35, 10765, 9648, 80]}
                />
              </div>
            )}

            {/* ASIAN DRAMAS TAB */}
            {activeTab === 'kdrama' && (
              <div className="animate-fadeIn">
                <MediaGrid
                  title="Asian Dramas & K-Dramas"
                  subtitle="Popular Korean, Japanese, Chinese, and Thai drama series"
                  items={filterByGenre(kdramas)}
                  onSelectMedia={handleSelectMedia}
                  watchlistIds={watchlistIds}
                  onToggleBookmark={handleToggleBookmark}
                  selectedGenreId={selectedGenreId}
                  onGenreSelect={setSelectedGenreId}
                  genreList={[18, 35, 10749, 9648]}
                />
              </div>
            )}

            {/* ANIME TAB */}
            {activeTab === 'anime' && (
              <div className="animate-fadeIn">
                <MediaGrid
                  title="Anime Collection"
                  subtitle="Subbed & dubbed Japanese anime series"
                  items={filterByGenre(anime)}
                  onSelectMedia={handleSelectMedia}
                  watchlistIds={watchlistIds}
                  onToggleBookmark={handleToggleBookmark}
                  selectedGenreId={selectedGenreId}
                  onGenreSelect={setSelectedGenreId}
                  genreList={[16, 10759, 35, 14, 878]}
                />
              </div>
            )}

            {/* LIVE TV TAB */}
            {activeTab === 'livetv' && <LiveTvView />}

            {/* MY LIST / WATCHLIST TAB */}
            {activeTab === 'watchlist' && (
              <WatchlistView
                watchlistItems={watchlist}
                watchHistory={watchHistory}
                onSelectMedia={handleSelectMedia}
                onToggleBookmark={handleToggleBookmark}
                onClearWatchlist={handleClearWatchlist}
                onClearHistory={handleClearHistory}
              />
            )}
          </>
        )}
      </main>

      {/* Global Modals */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectMedia={handleSelectMedia}
      />

      <ServerGuideModal
        isOpen={serverGuideOpen}
        onClose={() => setServerGuideOpen(false)}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        defaultServer={defaultServer}
        onDefaultServerChange={setDefaultServer}
        onClearHistory={handleClearHistory}
        onClearWatchlist={handleClearWatchlist}
      />

      <TrailerModal
        youtubeKey={trailerData?.key || null}
        title={trailerData?.title || ''}
        onClose={() => setTrailerData(null)}
      />

      {/* Footer */}
      <Footer
        onOpenServerGuide={() => setServerGuideOpen(true)}
        onOpenSettings={() => setSettingsOpen(false)}
      />
    </div>
  );
}

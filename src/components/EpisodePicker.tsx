import React, { useState, useEffect } from 'react';
import { Play, Calendar, Star, Clock } from 'lucide-react';
import { Season, Episode } from '../types';
import { fetchSeasons, fetchEpisodes, getImageUrl } from '../services/tmdb';

interface EpisodePickerProps {
  tvId: number;
  selectedSeason: number;
  selectedEpisode: number;
  onSelectEpisode: (season: number, episode: number, episodeTitle: string) => void;
}

export const EpisodePicker: React.FC<EpisodePickerProps> = ({
  tvId,
  selectedSeason,
  selectedEpisode,
  onSelectEpisode,
}) => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loadingSeasons, setLoadingSeasons] = useState(true);
  const [loadingEpisodes, setLoadingEpisodes] = useState(true);
  const [activeSeasonNum, setActiveSeasonNum] = useState<number>(selectedSeason);

  useEffect(() => {
    let isMounted = true;
    setLoadingSeasons(true);
    fetchSeasons(tvId).then(data => {
      if (!isMounted) return;
      setSeasons(data);
      setLoadingSeasons(false);
      if (data.length > 0 && !data.some(s => s.season_number === activeSeasonNum)) {
        setActiveSeasonNum(data[0].season_number);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [tvId]);

  useEffect(() => {
    let isMounted = true;
    setLoadingEpisodes(true);
    fetchEpisodes(tvId, activeSeasonNum).then(data => {
      if (!isMounted) return;
      setEpisodes(data);
      setLoadingEpisodes(false);
    });
    return () => {
      isMounted = false;
    };
  }, [tvId, activeSeasonNum]);

  return (
    <div className="bg-white/5 border border-white/10 rounded p-4 md:p-6 space-y-4">
      {/* Header & Season Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-yellow-400 inline-block"></span>
            Seasons & Episodes
          </h3>
          <p className="text-xs text-white/60 font-medium">Select season and episode to play instantly</p>
        </div>

        {/* Season Tabs */}
        {!loadingSeasons && seasons.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full touch-scroll no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0">
            {seasons.map(s => (
              <button
                key={s.id || s.season_number}
                onClick={() => setActiveSeasonNum(s.season_number)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all shrink-0 touch-manipulation ${
                  activeSeasonNum === s.season_number
                    ? 'bg-yellow-400 text-black font-black border border-yellow-400'
                    : 'bg-white/5 text-white/70 border border-white/10 hover:border-yellow-400/50 hover:text-yellow-400 active:border-yellow-400'
                }`}
              >
                Season {s.season_number}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Episode Grid */}
      {loadingEpisodes ? (
        <div className="py-8 text-center text-white/50 text-xs flex flex-col items-center gap-2 font-bold uppercase tracking-wider">
          <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading episodes list...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 max-h-[420px] overflow-y-auto pr-1 touch-scroll custom-scrollbar">
          {episodes.map(ep => {
            const isPlaying = activeSeasonNum === selectedSeason && ep.episode_number === selectedEpisode;

            return (
              <div
                key={ep.id || ep.episode_number}
                onClick={() => onSelectEpisode(activeSeasonNum, ep.episode_number, ep.name)}
                className={`group relative flex flex-row sm:flex-col p-2 sm:p-2.5 rounded border transition-all cursor-pointer touch-manipulation active:scale-[0.98] gap-2.5 sm:gap-0 ${
                  isPlaying
                    ? 'bg-yellow-400/10 border-yellow-400'
                    : 'bg-[#080808] border-white/10 hover:border-yellow-400/60'
                }`}
              >
                <div className="relative aspect-video w-28 sm:w-full rounded overflow-hidden bg-black shrink-0 sm:mb-2">
                  <img
                    src={getImageUrl(ep.still_path)}
                    alt={ep.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                      isPlaying ? 'bg-yellow-400/20' : 'bg-black/40 group-hover:bg-black/20'
                    }`}
                  >
                    <div
                      className={`p-1.5 sm:p-2 transition-transform ${
                        isPlaying
                          ? 'bg-yellow-400 text-black scale-110 font-black'
                          : 'bg-black/80 text-white group-hover:scale-110 group-hover:bg-yellow-400 group-hover:text-black'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                    </div>
                  </div>

                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-sm bg-yellow-400 text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                    E{ep.episode_number}
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h4
                      className={`text-xs font-bold uppercase line-clamp-1 ${
                        isPlaying ? 'text-yellow-400' : 'text-white group-hover:text-yellow-400'
                      }`}
                    >
                      E{ep.episode_number}. {ep.name}
                    </h4>
                    <p className="text-[11px] text-white/50 line-clamp-2 mt-0.5 sm:mt-1 leading-relaxed font-medium">
                      {ep.overview || 'No description available for this episode.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-medium opacity-50 uppercase tracking-wider text-white mt-1.5 sm:mt-2">
                    {ep.air_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {ep.air_date}
                      </span>
                    )}
                    {ep.runtime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {ep.runtime}m
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

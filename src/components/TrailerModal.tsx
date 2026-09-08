import React from 'react';
import { X } from 'lucide-react';

interface TrailerModalProps {
  youtubeKey: string | null;
  title: string;
  onClose: () => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({ youtubeKey, title, onClose }) => {
  if (!youtubeKey) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#080808] border border-white/10 rounded overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/80">
          <div className="flex items-center space-x-2">
            <span className="bg-yellow-400 text-black text-xs px-2 py-0.5 rounded-sm font-black uppercase tracking-wider">Trailer</span>
            <h3 className="text-base font-black uppercase tracking-tight text-white truncate max-w-md">{title} - Official Trailer</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeKey}?autoplay=1&rel=0`}
            title={`${title} Trailer`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

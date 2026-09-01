import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';

const MusicPlayer = () => {
  const { currentSong, isPlaying, togglePlay, playNext } = usePlayer();
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-bg-surface border-t border-slate-700 p-3 flex items-center gap-3 z-40">
      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        onEnded={playNext}
      />
      <img src={currentSong.coverUrl} className="w-12 h-12 rounded-lg" />
      <div className="flex-1 overflow-hidden" onClick={() => navigate('/now-playing')}>
        <p className="text-sm font-semibold truncate">{currentSong.title}</p>
        <p className="text-xs text-text-secondary truncate">{currentSong.artistName}</p>
      </div>
      <button onClick={togglePlay} className="p-2">
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
      <button onClick={playNext} className="p-2">
        <SkipForward size={20} />
      </button>
    </div>
  );
};

export default MusicPlayer;

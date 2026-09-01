import { useState } from 'react';
import { X } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

interface AddToPlaylistModalProps {
  songId: string;
  onClose: () => void;
}

const AddToPlaylistModal = ({ songId, onClose }: AddToPlaylistModalProps) => {
  const { playlists, addSongToPlaylist } = useLibrary();

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-bg-surface w-full max-w-sm rounded-3xl p-6 space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg">Add to Playlist</h2>
            <button onClick={onClose}><X /></button>
        </div>
        
        {playlists.map(pl => (
            <button key={pl._id} onClick={() => { addSongToPlaylist(pl._id, songId); onClose(); }} className="w-full text-left p-3 bg-slate-700 rounded-xl">
                {pl.name}
            </button>
        ))}
      </div>
    </div>
  );
};

export default AddToPlaylistModal;

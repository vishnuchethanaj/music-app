import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Music2 } from 'lucide-react';
import api from '../api/axios';

type Artist = {
  _id: string;
  username: string;
  bio: string;
  profileImage: string;
};

const ArtistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await api.get<{ artist: Artist }>(`/artist/${id}`);
        setArtist(response.data.artist);
      } catch (error) {
        console.error('Failed to fetch artist', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  if (loading) return <div className="p-6 text-center text-text-secondary">Loading profile...</div>;
  if (!artist) return <div className="p-6 text-center text-text-secondary">Artist not found.</div>;

  return (
    <div className="p-4 space-y-6">
      <section className="text-center pt-8">
        {artist.profileImage ? (
          <img src={artist.profileImage} alt={artist.username} className="mx-auto h-28 w-28 rounded-full mb-4 shadow-lg object-cover" />
        ) : (
          <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-4xl font-black uppercase shadow-lg">
            <User size={40} />
          </div>
        )}
        <h1 className="text-3xl font-black">{artist.username}</h1>
        <p className="mt-4 text-text-secondary max-w-sm mx-auto">{artist.bio || 'No bio available.'}</p>
      </section>

      <div className="rounded-3xl border border-slate-700 bg-bg-surface p-4 flex gap-4">
        <div className="flex-1 flex items-center justify-center gap-3 rounded-2xl bg-black/20 p-4">
            <Music2 size={20} className="text-brand-primary" />
            <span className="font-semibold">0 Songs</span>
        </div>
        <button className="flex-1 rounded-2xl bg-brand-primary px-4 py-3 font-semibold text-sm transition hover:bg-indigo-600">
          Follow
        </button>
      </div>
    </div>
  );
};

export default ArtistProfile;

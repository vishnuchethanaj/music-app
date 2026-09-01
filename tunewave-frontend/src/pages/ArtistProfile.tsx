import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Music2, Heart } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { usePlayer, type Song } from '../context/PlayerContext';

type Artist = {
  _id: string;
  username: string;
  bio: string;
  profileImage: string;
};

type FollowData = {
  following: boolean;
  followersCount: number;
};

const ArtistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [followData, setFollowData] = useState<FollowData>({ following: false, followersCount: 0 });
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, followArtist, unfollowArtist } = useAuth();
  const { playSong } = usePlayer();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistRes, followRes, songsRes] = await Promise.all([
          api.get<{ artist: Artist }>(`/artist/${id}`),
          api.get<FollowData>(`/artists/${id}/follow`),
          api.get<{ data: Song[] }>(`/songs`), // Simplified: filtering client-side or creating artist songs endpoint
        ]);
        setArtist(artistRes.data.artist);
        setFollowData(followRes.data);
        setSongs(songsRes.data.data.filter(s => s.artistId === id));
      } catch (error) {
        console.error('Failed to fetch artist profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleFollow = async () => {
    if (!artist) return;
    if (followData.following) {
      await unfollowArtist(artist._id);
      setFollowData(prev => ({ following: false, followersCount: prev.followersCount - 1 }));
    } else {
      await followArtist(artist._id);
      setFollowData(prev => ({ following: true, followersCount: prev.followersCount + 1 }));
    }
  };

  if (loading) return <div className="p-6 text-center text-text-secondary">Loading profile...</div>;
  if (!artist) return <div className="p-6 text-center text-text-secondary">Artist not found.</div>;

  const isOwnProfile = user?._id === artist._id;

  return (
    <div className="p-4 space-y-6 pb-24">
      <section className="text-center pt-8">
        {artist.profileImage ? (
          <img src={artist.profileImage} alt={artist.username} className="mx-auto h-28 w-28 rounded-full mb-4 shadow-lg object-cover" />
        ) : (
          <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-4xl font-black uppercase shadow-lg">
            <User size={40} />
          </div>
        )}
        <h1 className="text-3xl font-black">{artist.username}</h1>
        <p className="mt-2 text-text-secondary">{followData.followersCount} Followers</p>
        <p className="mt-4 text-text-secondary max-w-sm mx-auto">{artist.bio || 'No bio available.'}</p>
        
        {!isOwnProfile && (
            <button onClick={handleFollow} className={`mt-6 px-8 py-3 rounded-full font-bold ${followData.following ? 'bg-slate-700' : 'bg-brand-primary'}`}>
                {followData.following ? 'Following' : 'Follow'}
            </button>
        )}
      </section>

      <section>
          <h2 className="text-lg font-bold mb-3">Published Songs</h2>
          {songs.map((song) => (
            <div key={song._id} onClick={() => playSong(song, songs)} className="flex items-center gap-4 bg-bg-surface p-3 rounded-xl mb-2">
              <img src={song.coverUrl} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-sm">{song.title}</p>
              </div>
            </div>
          ))}
      </section>
    </div>
  );
};

export default ArtistProfile;

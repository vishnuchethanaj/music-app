import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import api from '../api/axios';

type FollowedArtist = {
  artistId: {
    _id: string;
    username: string;
    profileImage: string;
  };
};

const Following = () => {
  const [artists, setArtists] = useState<FollowedArtist[]>([]);

  useEffect(() => {
    // Assuming a route exists or needs to be added
    api.get<{ data: FollowedArtist[] }>('/artists/following').then(res => setArtists(res.data.data));
  }, []);

  return (
    <div className="p-4 space-y-6 pb-24">
      <h1 className="text-2xl font-black">Following</h1>
      {artists.length === 0 ? (
        <div className="text-center pt-10 text-text-secondary text-sm">
            <p>You aren't following any artists yet.</p>
            <Link to="/discover" className="text-brand-primary font-bold">Discover Artists</Link>
        </div>
      ) : (
        artists.map(f => (
            <Link to={`/artist/${f.artistId._id}`} key={f.artistId._id} className="flex items-center gap-4 bg-bg-surface p-3 rounded-xl mb-2">
                {f.artistId.profileImage ? (
                    <img src={f.artistId.profileImage} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center"><User /></div>
                )}
                <p className="font-semibold">{f.artistId.username}</p>
            </Link>
        ))
      )}
    </div>
  );
};

export default Following;

const Library = () => {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mt-2">Your Library</h1>
      
      <div className="flex space-x-2">
        {['Playlists', 'Liked Songs', 'Following'].map((tab, idx) => (
          <button key={idx} className={`px-4 py-2 rounded-full text-sm font-medium ${
            idx === 0 ? 'bg-brand-primary text-white' : 'bg-bg-surface text-text-primary'
          }`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-slate-700 rounded-lg shadow-md"></div>
            <div>
              <p className="font-semibold">My Playlist {i}</p>
              <p className="text-sm text-text-secondary">12 songs</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;

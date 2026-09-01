const Discover = () => {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mt-2">Discover</h1>
      
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search songs, artists, or genres..." 
          className="w-full bg-bg-surface border border-slate-700 rounded-full py-3 px-12 text-sm focus:outline-none focus:border-brand-primary transition-colors"
        />
        <svg className="w-5 h-5 absolute left-4 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {['Pop', 'Hip Hop', 'Indie', 'Electronic', 'Jazz', 'Rock'].map((genre, idx) => (
          <div key={idx} className={`h-24 rounded-xl p-4 font-semibold text-lg flex items-end ${
            idx % 2 === 0 ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-pink-500 to-rose-500'
          }`}>
            {genre}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discover;

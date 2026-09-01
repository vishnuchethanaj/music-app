const Home = () => {
  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center py-2">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
          TuneWave
        </h1>
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
          <span className="text-sm font-semibold">U</span>
        </div>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-4">Trending Now</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[140px] space-y-2">
              <div className="w-[140px] h-[140px] bg-slate-700 rounded-2xl shadow-lg"></div>
              <p className="font-medium text-sm truncate">Song Title {i}</p>
              <p className="text-xs text-text-secondary truncate">Artist Name</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">New Releases</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center p-3 bg-bg-surface rounded-xl space-x-4">
              <div className="w-16 h-16 bg-slate-600 rounded-lg shadow-md"></div>
              <div className="flex-1">
                <p className="font-medium">Track {i}</p>
                <p className="text-sm text-text-secondary">Independent Artist</p>
              </div>
              <button className="w-8 h-8 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center">
                ▶
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

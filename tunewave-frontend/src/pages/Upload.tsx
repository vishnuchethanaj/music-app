const Upload = () => {
  return (
    <div className="p-4 space-y-6 flex flex-col items-center justify-center min-h-full">
      <div className="text-center space-y-4 max-w-sm mx-auto">
        <div className="w-20 h-20 bg-brand-primary/20 text-brand-primary rounded-full flex items-center justify-center mx-auto">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Become an Artist</h1>
        <p className="text-text-secondary text-sm">
          Upload your original music and share it with the world. Join our community of independent creators.
        </p>
        <button className="w-full py-3 bg-brand-primary text-white font-semibold rounded-full mt-6 shadow-lg shadow-brand-primary/30">
          Start Uploading
        </button>
      </div>
    </div>
  );
};

export default Upload;

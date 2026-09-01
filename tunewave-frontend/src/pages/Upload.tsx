import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Music2, Image as ImageIcon } from 'lucide-react';
import api from '../api/axios';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!audioFile || !title || !genre) {
      setError('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('genre', genre);
    formData.append('description', description);
    formData.append('audio', audioFile);
    if (coverFile) formData.append('cover', coverFile);

    setIsLoading(true);
    try {
      await api.post('/songs/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/artist-dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <h1 className="text-2xl font-black">Upload Song</h1>
      <form onSubmit={handleSubmit} className="space-y-4 card">
        {error && <div className="text-red-400 text-sm p-2 bg-red-950/30 rounded-lg">{error}</div>}
        
        <input type="text" placeholder="Song Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full input-field" />
        <input type="text" placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full input-field" />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full input-field" />

        <div className="flex gap-4">
          <label className="flex-1 cursor-pointer bg-slate-700/50 p-4 rounded-xl flex items-center justify-center gap-2 border border-slate-700">
            <Music2 size={18} /> {audioFile ? audioFile.name : 'Select Audio'}
            <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} className="hidden" />
          </label>
          <label className="flex-1 cursor-pointer bg-slate-700/50 p-4 rounded-xl flex items-center justify-center gap-2 border border-slate-700">
            <ImageIcon size={18} /> {coverFile ? coverFile.name : 'Select Cover'}
            <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className="hidden" />
          </label>
        </div>

        <button type="submit" disabled={isLoading} className="w-full btn-primary">
          {isLoading ? 'Uploading...' : 'Publish Song'}
        </button>
      </form>
    </div>
  );
};

export default Upload;

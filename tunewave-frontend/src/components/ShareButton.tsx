import { Share2 } from 'lucide-react';

const ShareButton = ({ url, title }: { url: string; title: string }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url, title });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <button onClick={handleShare} className="p-3 bg-bg-surface rounded-full">
      <Share2 size={20} />
    </button>
  );
};

export default ShareButton;

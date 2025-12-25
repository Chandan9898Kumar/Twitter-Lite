import { useState } from 'react';
import { postsAPI } from '../services/api';
import './CreatePost.css';

interface CreatePostProps {
  onPostCreated: () => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('content', content);
    if (image) formData.append('image', image);
    
    try {
      await postsAPI.createPost(formData);
      setContent('');
      setImage(null);
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <form onSubmit={handleSubmit} className="create-post-form">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          maxLength={280}
          className="post-textarea"
        />
        <div className="post-actions">
          <div className="post-options">
            <label className="image-upload-btn">
              📷 Photo
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                hidden
              />
            </label>
            {image && <span className="image-selected">✓ Image selected</span>}
          </div>
          <div className="post-submit">
            <span className={`char-count ${280 - content.length < 20 ? 'warning' : ''}`}>
              {280 - content.length}
            </span>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="tweet-btn"
            >
              {loading ? 'Posting...' : 'Tweet'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
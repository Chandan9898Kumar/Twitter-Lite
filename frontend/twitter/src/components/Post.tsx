import { useState } from 'react';
import type { Post as PostType } from '../types/index.js';
import { postsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuthHook';
import './Post.css';

interface PostProps {
  post: PostType;
  onPostUpdate: () => void;
}

const Post = ({ post, onPostUpdate }: PostProps) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleLike = async () => {
    try {
      await postsAPI.likePost(post._id);
      onPostUpdate();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await postsAPI.addComment(post._id, newComment);
      setNewComment('');
      onPostUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const isLiked = user && post.likes.some(like => like.id === user.id);
  const timeAgo = new Date(post.createdAt).toLocaleString();
console.log(isLiked,'isLiked',user,post.likes)
  return (
    <article className="post-card">
      <div className="post-header">
        <div className="user-avatar">
          {post.author.username.charAt(0).toUpperCase()}
        </div>
        <div className="post-meta">
          <h4 className="username">@{post.author.username}</h4>
          <span className="post-time">{timeAgo}</span>
        </div>
      </div>
      
      <div className="post-content">
        <p>{post.content}</p>
        {post.image && (
          <div className="post-image">
            <img 
              src={`http://localhost:5000/uploads/${post.image}`} 
              alt="Post attachment"
            />
          </div>
        )}
      </div>
      
      <div className="post-actions">
        <button
          onClick={handleLike}
          className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
        >
          <span className="action-icon">{isLiked ? '❤️' : '🤍'}</span>
          <span className="action-count">{post.likes.length}</span>
        </button>
        
        <button
          onClick={() => setShowComments(!showComments)}
          className="action-btn comment-btn"
        >
          <span className="action-icon">💬</span>
          <span className="action-count">{post.comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleComment} className="comment-form">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="comment-input"
            />
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="comment-submit"
            >
              {loading ? '⏳' : '➤'}
            </button>
          </form>
          
          <div className="comments-list">
            {post.comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                <div className="comment-avatar">
                  {comment.author.username.charAt(0).toUpperCase()}
                </div>
                <div className="comment-content">
                  <div className="comment-header">
                    <strong className="comment-username">@{comment.author.username}</strong>
                    <span className="comment-time">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="comment-text">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default Post;
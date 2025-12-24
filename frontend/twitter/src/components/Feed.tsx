import { useState, useEffect } from 'react';
import type { Post as PostType } from '../types/index.js';
import { postsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuthHook';
import socketService from '../services/socket';
import CreatePost from './CreatePost';
import Post from './Post';
import './Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    
    socketService.connect();
    
    socketService.onNewPost((newPost) => {
      setPosts(prev => [newPost, ...prev]);
    });
    
    socketService.onPostLiked(({ postId, likes }) => {
      setPosts(prev => prev.map(post => 
        post._id === postId ? { ...post, likes } : post
      ));
    });
    
    socketService.onNewComment(({ postId, comment }) => {
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, comments: [...post.comments, comment] }
          : post
      ));
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your feed...</p>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <header className="feed-header">
        <div className="header-content">
          <h1 className="app-title">🐦 Twitter Lite</h1>
          <div className="user-info">
            <span className="welcome-text">Welcome, <strong>{user?.username}</strong>!</span>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="feed-main">
        <CreatePost onPostCreated={fetchPosts} />
        
        <div className="posts-container">
          {posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No posts yet</h3>
              <p>Be the first to share something!</p>
            </div>
          ) : (
            posts.map((post) => (
              <Post key={post._id} post={post} onPostUpdate={fetchPosts} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Feed;
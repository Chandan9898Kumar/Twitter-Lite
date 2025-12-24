import { io, Socket } from 'socket.io-client';
import type { Post, Comment } from '../types/index.js';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    this.socket = io('http://localhost:5000');
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onNewPost(callback: (post: Post) => void) {
    this.socket?.on('newPost', callback);
  }

  onPostLiked(callback: (data: { postId: string; likes: any[] }) => void) {
    this.socket?.on('postLiked', callback);
  }

  onNewComment(callback: (data: { postId: string; comment: Comment }) => void) {
    this.socket?.on('newComment', callback);
  }

  off(event: string) {
    this.socket?.off(event);
  }
}

export default new SocketService();
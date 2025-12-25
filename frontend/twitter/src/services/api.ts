import axios from 'axios';
import type { AuthResponse, Post, Comment } from '../types/index.js';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Include cookies in requests
});

export const authAPI = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
  
  register: (username: string, email: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { username, email, password }),
  
  me: () => api.get('/auth/me'),
  
  logout: () => api.post('/auth/logout'),
};

export const postsAPI = {
  getPosts: () => api.get<Post[]>('/posts'),
  
  createPost: (formData: FormData) =>
    api.post<Post>('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  likePost: (postId: string) =>
    api.post(`/posts/${postId}/like`),
  
  addComment: (postId: string, content: string) =>
    api.post<Comment>(`/posts/${postId}/comment`, { content }),
};
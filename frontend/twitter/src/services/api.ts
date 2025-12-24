import axios from 'axios';
import type { AuthResponse, Post, Comment } from '../types/index.js';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
  
  register: (username: string, email: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { username, email, password }),
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
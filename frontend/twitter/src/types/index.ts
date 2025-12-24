export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  post: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  content: string;
  image?: string;
  author: User;
  likes: User[];
  comments: Comment[];
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
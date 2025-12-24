# Twitter Lite - Social Feed System

A simple Twitter-like social media application with real-time updates.

## Features

- User authentication (login/register)
- Create posts with text and images
- Like and comment on posts
- Real-time updates using WebSockets
- Rate limiting for post creation
- Responsive design

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Socket.IO for real-time updates
- Multer for file uploads
- Rate limiting

### Frontend
- React with TypeScript
- Socket.IO client for real-time updates
- Axios for API calls
- Vite for development

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start MongoDB (if using local installation)

4. Start the server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend/twitter
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:3000

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Posts
- GET `/api/posts` - Get all posts
- POST `/api/posts` - Create new post (with rate limiting)
- POST `/api/posts/:id/like` - Like/unlike post
- POST `/api/posts/:id/comment` - Add comment to post

## Database Schema

### Users
- username (unique)
- email (unique)
- password (hashed)
- avatar
- createdAt

### Posts
- content (max 280 characters)
- image (optional)
- author (User reference)
- likes (User references array)
- comments (Comment references array)
- createdAt

### Comments
- content (max 280 characters)
- author (User reference)
- post (Post reference)
- createdAt

## Real-time Features

- New posts appear instantly for all users
- Like counts update in real-time
- Comments appear immediately when added
- WebSocket connection for live updates

## Rate Limiting

- Post creation: 5 posts per 15 minutes per user
- Prevents spam and abuse

## Environment Variables

Create `.env` file in backend directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/twitter-lite
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```
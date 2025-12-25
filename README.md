# Twitter Lite - Social Feed System

A modern Twitter-like social media application with real-time updates, secure authentication, and multi-user interactions.

![Twitter Lite](https://img.shields.io/badge/Status-Active-green)
![Node.js](https://img.shields.io/badge/Node.js-v16+-blue)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Cloud-green)

## ✨ Features

### 🔐 Authentication & Security
- **Secure Registration/Login** with JWT tokens
- **HttpOnly Cookies** for enhanced security (no localStorage vulnerabilities)
- **Password Hashing** with bcryptjs
- **User Session Management**

### 📱 Social Features
- **Create Posts** with text and image uploads
- **Like/Unlike Posts** with real-time updates
- **Comment System** with nested author population
- **Multi-User Interactions** - users can interact with each other's content


### ⚡ Real-time Updates
- **WebSocket Integration** with Socket.IO
- **Live Post Updates** - new posts appear instantly
- **Real-time Like Counts** - see likes update immediately
- **Instant Comments** - comments appear without refresh

### 🛡️ Performance & Security
- **Rate Limiting** - 5 posts per 15 minutes per user
- **File Upload Security** with Multer (5MB limit)
- **CORS Protection** with credentials support
- **Input Validation** and sanitization

## 🏗️ Tech Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB Atlas** (Cloud Database)
- **Mongoose** ODM for data modeling
- **JWT** for authentication
- **Socket.IO** for real-time communication
- **Multer** for file uploads
- **bcryptjs** for password hashing
- **express-rate-limit** for API protection
- **cookie-parser** for secure cookie handling

### Frontend
- **React 19.2.0** with TypeScript
- **Vite** for fast development and building
- **Axios** for API communication
- **Socket.IO Client** for real-time updates
- **React Context** for state management
- **CSS Modules** for styling

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

### 📥 Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd Ey
```

2. **Install Backend Dependencies:**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies:**
```bash
cd ../frontend/twitter
npm install
```

### 🔧 Environment Setup

#### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT Secret (Use a strong, unique secret in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars

# Environment
NODE_ENV=development
```

#### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster:**
   - Click "Build a Database"
   - Choose "FREE" tier
   - Select your preferred region
   - Create cluster

3. **Create Database User:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and strong password
   - Grant "Read and write to any database" role

4. **Configure Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
   - For production, use specific IP addresses

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<database>` with your database name (e.g., `twitter-lite`)

### 🏃‍♂️ Running the Application

#### Start Backend Server
```bash
cd backend
npm run dev
```
✅ Backend will run on: `http://localhost:5000`

#### Start Frontend Development Server
```bash
cd frontend/twitter
npm run dev
```
✅ Frontend will run on: `http://localhost:5173`

#### Seed Test Users (Optional)
```bash
cd backend
npm run seed
```
This creates test users: Alice, Bob, and Charlie for easy testing.

## 📡 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | `{username, email, password}` |
| POST | `/api/auth/login` | Login user | `{email, password}` |
| GET | `/api/auth/me` | Get current user | - |
| POST | `/api/auth/logout` | Logout user | - |

### Posts Endpoints
| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/api/posts` | Get all posts | - |
| POST | `/api/posts` | Create new post | `{content, image?}` |
| POST | `/api/posts/:id/like` | Like/unlike post | - |
| POST | `/api/posts/:id/comment` | Add comment | `{content}` |

### Response Examples

#### Get Posts Response:
```json
{
  "_id": "post123",
  "content": "Hello World!",
  "image": "image.jpg",
  "author": {
    "_id": "user123",
    "username": "john",
    "avatar": "avatar.jpg"
  },
  "likes": [
    {
      "_id": "user456",
      "username": "alice",
      "avatar": "alice.jpg",
      "createdAt": "2025-12-25T10:00:00Z"
    }
  ],
  "comments": [
    {
      "_id": "comment123",
      "content": "Great post!",
      "author": {
        "_id": "user789",
        "username": "bob"
      },
      "createdAt": "2025-12-25T11:00:00Z"
    }
  ],
  "createdAt": "2025-12-25T09:00:00Z"
}
```

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  avatar: String (default: ''),
  createdAt: Date (default: Date.now)
}
```

### Posts Collection
```javascript
{
  _id: ObjectId,
  content: String (required, max: 280 chars),
  image: String (optional),
  author: ObjectId (ref: 'User'),
  likes: [ObjectId] (ref: 'User'),
  comments: [ObjectId] (ref: 'Comment'),
  createdAt: Date (default: Date.now)
}
```

### Comments Collection
```javascript
{
  _id: ObjectId,
  content: String (required, max: 280 chars),
  author: ObjectId (ref: 'User'),
  post: ObjectId (ref: 'Post'),
  createdAt: Date (default: Date.now)
}
```

## 🔄 Real-time Features

### WebSocket Events
- **`newPost`** - Broadcast when new post is created
- **`postLiked`** - Broadcast when post is liked/unliked
- **`newComment`** - Broadcast when comment is added

### Socket.IO Implementation
```javascript
// Backend - Broadcasting events
io.emit('newPost', post);
io.emit('postLiked', { postId, likes });
io.emit('newComment', { postId, comment });

// Frontend - Listening to events
socket.on('newPost', handleNewPost);
socket.on('postLiked', handlePostLiked);
socket.on('newComment', handleNewComment);
```

## 🛡️ Security Features

### Authentication Security
- **HttpOnly Cookies** - Tokens stored in secure cookies, not localStorage
- **JWT Expiration** - 7-day token lifetime
- **Password Hashing** - bcryptjs with salt rounds
- **CORS Configuration** - Restricted origins with credentials

### API Security
- **Rate Limiting** - 5 posts per 15 minutes
- **File Upload Limits** - 5MB maximum file size
- **Input Validation** - Mongoose schema validation
- **Error Handling** - Secure error messages

## 🧪 Testing Multi-User Interactions

### Multiple Browsers Method
1. **Chrome**: Login as Alice
2. **Firefox**: Login as Bob
3. **Edge/Incognito**: Login as Charlie
4. Create posts and interact across browsers

### Test Scenarios
1. **Alice** creates a post
2. **Bob** likes Alice's post
3. **Charlie** comments on Alice's post
4. All users see real-time updates

## 📁 Project Structure

```
Ey/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── models/
│   │   ├── User.js          # User schema
│   │   ├── Post.js          # Post schema
│   │   └── Comment.js       # Comment schema
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── posts.js         # Posts and comments routes
│   ├── uploads/             # File upload directory
│   ├── .env                 # Environment variables
│   ├── index.js             # Server entry point
│   ├── seedUsers.js         # Test user seeder
│   └── package.json         # Backend dependencies
├── frontend/twitter/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Auth.tsx     # Login/Register form
│   │   │   ├── AuthProvider.tsx # Auth context provider
│   │   │   ├── Feed.tsx     # Main feed component
│   │   │   ├── Post.tsx     # Individual post component
│   │   │   └── CreatePost.tsx # Post creation form
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript type definitions
│   │   └── App.tsx          # Main app component
│   ├── package.json         # Frontend dependencies
│   └── vite.config.ts       # Vite configuration
└── README.md                # This file
```

## 🚨 Troubleshooting

### Common Issues

#### Backend Issues

**MongoDB Connection Error:**
```
Error: MongoNetworkError: failed to connect to server
```
**Solution:**
- Check MongoDB Atlas connection string
- Verify database user credentials
- Ensure IP address is whitelisted
- Check network connectivity

**JWT Secret Error:**
```
Error: secretOrPrivateKey has a minimum key size of 256 bits
```
**Solution:**
- Use a JWT secret with at least 32 characters
- Update `.env` file with a stronger secret

#### Frontend Issues

**CORS Error:**
```
Access to XMLHttpRequest at 'http://localhost:5000' from origin 'http://localhost:5173' has been blocked by CORS policy
```
**Solution:**
- Ensure backend CORS is configured for `http://localhost:5173`
- Check if backend server is running

**Cookie Not Set:**
```
User not authenticated after login
```
**Solution:**
- Verify `withCredentials: true` in axios configuration
- Check if cookies are enabled in browser
- Ensure backend sets `credentials: true` in CORS

### Port Conflicts

If ports 5000 or 5173 are in use:

**Backend (Port 5000):**
```bash
# Change PORT in .env file
PORT=3001
```

**Frontend (Port 5173):**
```bash
# Use different port
npm run dev -- --port 3000
```

## 🔧 Development Scripts

### Backend Scripts
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Create test users
```

### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🚀 Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-secret-min-32-chars
```

### Security Checklist
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable MongoDB Atlas IP whitelisting
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set secure cookie flags
- [ ] Enable rate limiting
- [ ] Validate all inputs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure environment variables are correctly set
4. Check that both backend and frontend servers are running

---

**Happy Coding! 🎉**
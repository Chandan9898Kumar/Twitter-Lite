# Twitter Lite Backend

A robust Node.js backend for a Twitter-like social media application with real-time features, secure authentication, and scalable database design.

![Node.js](https://img.shields.io/badge/Node.js-v16+-green)
![Express](https://img.shields.io/badge/Express-4.18.2-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7.4-black)

## 🏗️ Architecture Overview

### Tech Stack
- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT with HttpOnly cookies
- **Real-time**: Socket.IO
- **File Upload**: Multer
- **Security**: bcryptjs, CORS, Rate limiting

### Design Principles
- **RESTful API** design
- **Secure authentication** with HttpOnly cookies
- **Real-time updates** via WebSockets
- **Relational data modeling** with MongoDB references
- **Input validation** and error handling
- **Rate limiting** for abuse prevention

## 📊 Database Schema Design

### Why This Schema Design?

Our schema follows **relational principles** in a NoSQL database, using MongoDB's reference system to maintain data integrity and enable complex queries.

### 1. User Schema (`models/User.js`)

```javascript
{
  _id: ObjectId,                    // Auto-generated unique identifier
  username: String,                 // Unique, trimmed username
  email: String,                    // Unique, trimmed email
  password: String,                 // Bcrypt hashed password
  avatar: String,                   // Profile picture filename (default: '')
  createdAt: Date                   // Account creation timestamp
}
```

**Key Features:**
- **Password Security**: Pre-save middleware automatically hashes passwords with bcrypt (12 salt rounds)
- **Unique Constraints**: Both username and email are unique to prevent duplicates
- **Instance Methods**: `comparePassword()` method for secure password verification
- **Data Validation**: Mongoose schema validation with required fields and trimming

**Why This Design:**
```javascript
// Pre-save middleware for automatic password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method for password comparison
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};
```

### 2. Post Schema (`models/Post.js`)

```javascript
{
  _id: ObjectId,                    // Auto-generated unique identifier
  content: String,                  // Post text (max 280 chars, like Twitter)
  image: String,                    // Optional image filename
  author: ObjectId,                 // Reference to User who created the post
  likes: [ObjectId],                // Array of User references who liked
  comments: [ObjectId],             // Array of Comment references
  createdAt: Date                   // Post creation timestamp
}
```

**Relationship Design:**
- **One-to-Many**: User → Posts (one user can have many posts)
- **Many-to-Many**: Users ↔ Likes (many users can like many posts)
- **One-to-Many**: Post → Comments (one post can have many comments)

**Why References Instead of Embedding:**
```javascript
// ✅ Good: Using references
author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

// ❌ Bad: Embedding user data
author: {
  username: String,
  email: String,
  avatar: String
}
```

**Benefits of Reference Design:**
1. **Data Consistency**: User info updates automatically everywhere
2. **Storage Efficiency**: No data duplication
3. **Scalability**: Can handle millions of likes without document size limits
4. **Query Flexibility**: Can populate different fields as needed

### 3. Comment Schema (`models/Comment.js`)

```javascript
{
  _id: ObjectId,                    // Auto-generated unique identifier
  content: String,                  // Comment text (max 280 chars)
  author: ObjectId,                 // Reference to User who wrote comment
  post: ObjectId,                   // Reference to Post being commented on
  createdAt: Date                   // Comment creation timestamp
}
```

**Relationship Design:**
- **Many-to-One**: Comments → User (many comments by one user)
- **Many-to-One**: Comments → Post (many comments on one post)

**Why Separate Comment Collection:**
```javascript
// ✅ Good: Separate collection with references
const comment = new Comment({
  content: 'Great post!',
  author: userId,
  post: postId
});

// ❌ Bad: Embedding in Post document
post.comments.push({
  content: 'Great post!',
  author: { username: 'john', email: 'john@test.com' }
});
```

**Benefits:**
1. **Unlimited Comments**: No 16MB document size limit
2. **Comment Queries**: Can query comments independently
3. **User Activity**: Can find all comments by a user
4. **Moderation**: Easy to delete/moderate individual comments

## 🔐 Authentication System

### JWT + HttpOnly Cookies Architecture

**Why HttpOnly Cookies Over localStorage:**

| localStorage | HttpOnly Cookies |
|-------------|------------------|
| ❌ Vulnerable to XSS | ✅ XSS Protected |
| ❌ Manual token management | ✅ Automatic handling |
| ❌ Visible in DevTools | ✅ Hidden from JavaScript |
| ❌ No automatic expiration | ✅ Built-in expiration |

### Authentication Flow

```javascript
// 1. Registration/Login - Set secure cookie
res.cookie('token', token, {
  httpOnly: true,                    // Cannot be accessed by JavaScript
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict',               // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days expiration
});

// 2. Authentication Middleware - Verify cookie
export const auth = async (req, res, next) => {
  const token = req.cookies.token;   // Read from cookie
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId);
  req.user = user;                   // Attach user to request
  next();
};
```

### Security Features

1. **Password Hashing**: bcrypt with 12 salt rounds
2. **JWT Secrets**: Strong secret keys (32+ characters)
3. **Cookie Security**: HttpOnly, Secure, SameSite
4. **Token Expiration**: 7-day automatic expiration
5. **CORS Protection**: Restricted origins with credentials

## 🚀 API Endpoints

### Authentication Routes (`routes/auth.js`)

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/auth/register` | Create new user account | None |
| POST | `/api/auth/login` | Login existing user | None |
| GET | `/api/auth/me` | Get current user info | Required |
| POST | `/api/auth/logout` | Logout user | None |

**Registration Flow:**
```javascript
// 1. Validate input
const { username, email, password } = req.body;

// 2. Check for existing user
const existingUser = await User.findOne({ $or: [{ email }, { username }] });

// 3. Create user (password auto-hashed by pre-save middleware)
const user = new User({ username, email, password });
await user.save();

// 4. Generate JWT and set cookie
const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
res.cookie('token', token, cookieOptions);
```

### Posts Routes (`routes/posts.js`)

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/api/posts` | Get all posts with pagination | None |
| POST | `/api/posts` | Create new post | Required |
| POST | `/api/posts/:id/like` | Like/unlike post | Required |
| POST | `/api/posts/:id/comment` | Add comment to post | Required |

**Advanced Features:**
- **Rate Limiting**: 5 posts per 15 minutes per user
- **File Upload**: Image uploads with 5MB limit
- **Population**: Automatic author/likes/comments population
- **Real-time**: Socket.IO broadcasts for live updates

## 🔄 Real-time Features (Socket.IO)

### WebSocket Events

```javascript
// Server broadcasts these events:
io.emit('newPost', post);                    // New post created
io.emit('postLiked', { postId, likes });     // Post liked/unliked
io.emit('newComment', { postId, comment });  // New comment added
```

### Implementation

```javascript
// 1. Create HTTP server with Socket.IO
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

// 2. Make io accessible to routes
app.set('io', io);

// 3. Broadcast from route handlers
req.app.get('io').emit('newPost', post);
```

**Why Real-time:**
- **Instant Updates**: Users see new content immediately
- **Better UX**: No need to refresh page
- **Social Engagement**: Live like counts and comments
- **Scalability**: Efficient WebSocket connections

## 📈 Data Population Strategy

### Why Population Over Embedding

**Population Example:**
```javascript
// Fetch posts with related data
const posts = await Post.find()
  .populate('author', 'username avatar')           // Get author info
  .populate('likes', 'username')                   // Get users who liked
  .populate({                                      // Nested population
    path: 'comments',
    populate: { path: 'author', select: 'username' }
  });
```

**Database Queries Generated:**
1. `Post.find()` - Get all posts
2. `User.find({ _id: { $in: [authorIds] } })` - Get authors
3. `User.find({ _id: { $in: [likeUserIds] } })` - Get likers
4. `Comment.find({ _id: { $in: [commentIds] } })` - Get comments
5. `User.find({ _id: { $in: [commentAuthorIds] } })` - Get comment authors

**Performance Considerations:**
- **Selective Population**: Only populate needed fields
- **Pagination**: Limit results (20 posts per request)
- **Indexing**: Database indexes on referenced fields
- **Caching**: Can add Redis caching layer

## 🛡️ Security Implementation

### Rate Limiting
```javascript
const postLimit = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                    // 5 posts per window
  message: { message: 'Too many posts, try again later' }
});
```

### File Upload Security
```javascript
const upload = multer({ 
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }  // 5MB limit
});
```

### CORS Configuration
```javascript
app.use(cors({
  origin: "http://localhost:5173",  // Specific origin
  credentials: true                 // Allow cookies
}));
```

## 📁 Project Structure

```
backend/
├── models/
│   ├── User.js          # User schema with auth methods
│   ├── Post.js          # Post schema with references
│   └── Comment.js       # Comment schema
├── routes/
│   ├── auth.js          # Authentication endpoints
│   └── posts.js         # Posts and comments endpoints
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── uploads/             # File upload directory
├── index.js             # Server entry point
├── seedUsers.js         # Test data seeder
├── package.json         # Dependencies and scripts
└── .env                 # Environment variables
```

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB Atlas account
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed test users (optional)
npm run seed

# Start development server
npm run dev
```

### Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
NODE_ENV=development
```

## 🧪 Testing

### API Testing with curl

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

**Create Post:**
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -b "token=your-jwt-token" \
  -d '{"content":"Hello World!"}'
```

### Database Queries

**Find User's Posts:**
```javascript
const userPosts = await Post.find({ author: userId })
  .populate('author', 'username')
  .sort({ createdAt: -1 });
```

**Find Posts User Liked:**
```javascript
const likedPosts = await Post.find({ likes: userId })
  .populate('author', 'username');
```

## 📊 Performance Optimization

### Database Indexes
```javascript
// Recommended indexes for better performance
db.posts.createIndex({ createdAt: -1 });     // Sort by date
db.posts.createIndex({ author: 1 });         // Find user's posts
db.comments.createIndex({ post: 1 });        // Find post's comments
db.users.createIndex({ email: 1 });          // Login queries
db.users.createIndex({ username: 1 });       // Username lookups
```

### Query Optimization
- **Pagination**: Limit results to prevent large responses
- **Selective Population**: Only populate needed fields
- **Lean Queries**: Use `.lean()` for read-only operations
- **Aggregation**: Use aggregation pipeline for complex queries

## 🔧 Development Scripts

```bash
npm run dev      # Start with nodemon (auto-restart)
npm start        # Start production server
npm run seed     # Create test users
```

## 🚀 Production Deployment

### Security Checklist
- [ ] Strong JWT secret (32+ characters)
- [ ] HTTPS enabled (secure cookies)
- [ ] Environment variables secured
- [ ] Rate limiting enabled
- [ ] File upload restrictions
- [ ] CORS properly configured
- [ ] Database connection secured
- [ ] Error handling implemented

### Environment Setup
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://prod-user:secure-password@cluster.mongodb.net/twitter-prod
JWT_SECRET=production-secret-key-very-long-and-secure
```

---

This backend provides a solid foundation for a scalable social media application with proper security, real-time features, and efficient data modeling.
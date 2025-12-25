import express from 'express';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import { auth } from '../middleware/auth.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

const router = express.Router();

// Rate limiting for post creation
const postLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 posts per 15 minutes
  message: { message: 'Too many posts, try again later' }
});

// Multer for image uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username avatar')
      .populate('likes', 'username')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username' }
      })
      .sort({ createdAt: -1 })
      .limit(20);
    
    // Transform likes to have consistent id field
    const transformedPosts = posts.map(post => ({
      ...post.toObject(),
      likes: post.likes.map(like => ({
        id: like._id,
        username: like.username
      }))
    }));
    
    res.json(transformedPosts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create post
router.post('/', auth, postLimit, upload.single('image'), async (req, res) => {
  try {
    const { content } = req.body;
    const image = req.file ? req.file.filename : '';
    
    const post = new Post({
      content,
      image,
      author: req.user._id
    });
    
    await post.save();
    await post.populate('author', 'username avatar');
    
    // Emit to all connected clients
    req.app.get('io').emit('newPost', post);
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    const isLiked = post.likes.includes(req.user._id);
    
    if (isLiked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.push(req.user._id);
    }
    
    await post.save();
    await post.populate('likes', 'username');
    
    // Transform likes to have consistent id field
    const transformedLikes = post.likes.map(like => ({
      id: like._id,
      username: like.username
    }));
    
    // Emit like update
    req.app.get('io').emit('postLiked', { postId: post._id, likes: transformedLikes });
    
    res.json({ likes: transformedLikes, isLiked: !isLiked });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    const comment = new Comment({
      content,
      author: req.user._id,
      post: post._id
    });
    
    await comment.save();
    await comment.populate('author', 'username');
    
    post.comments.push(comment._id);
    await post.save();
    
    // Emit new comment
    req.app.get('io').emit('newComment', { postId: post._id, comment });
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
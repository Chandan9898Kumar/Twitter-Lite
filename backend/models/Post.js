import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  content: { type: String, required: true, maxlength: 280 },
  image: { type: String, default: '' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Post', postSchema);
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const testUsers = [
  {
    username: 'alice',
    email: 'alice@test.com',
    password: 'password123'
  },
  {
    username: 'bob',
    email: 'bob@test.com',
    password: 'password123'
  },
  {
    username: 'charlie',
    email: 'charlie@test.com',
    password: 'password123'
  }
];

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing test users
    await User.deleteMany({ email: { $in: testUsers.map(u => u.email) } });
    console.log('Cleared existing test users');

    // Create test users
    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${userData.username}`);
    }

    console.log('✅ Test users created successfully!');
    console.log('You can now switch between users in the app');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();
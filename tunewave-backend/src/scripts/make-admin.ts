import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';

dotenv.config();

const promoteToAdmin = async (username: string): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not configured');

  await mongoose.connect(uri);
  const user = await User.findOneAndUpdate({ username }, { role: 'admin' }, { new: true });
  
  if (user) {
    console.log(`User ${username} promoted to admin`);
  } else {
    console.log(`User ${username} not found`);
  }
  await mongoose.disconnect();
};

const username = process.argv[2];
if (!username) {
  console.error('Please provide a username');
  process.exit(1);
}

void promoteToAdmin(username);

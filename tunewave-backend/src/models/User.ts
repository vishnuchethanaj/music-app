import { Schema, model, type HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';

export interface User {
  username: string;
  email: string;
  password: string;
  profileImage: string;
  isArtist: boolean;
  bio: string;
  artistName?: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;

const UserSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username must be 30 characters or less'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    profileImage: {
      type: String,
      default: '',
    },
    isArtist: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      default: '',
      maxlength: [280, 'Bio must be 280 characters or less'],
    },
    artistName: {
      type: String,
      trim: true,
      maxlength: [50, 'Artist name must be 50 characters or less'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        const output = ret as { password?: unknown; __v?: unknown };
        delete output.password;
        delete output.__v;
        return output;
      },
    },
  },
);

UserSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: 'string' } } },
);
UserSchema.index(
  { username: 1 },
  { unique: true, partialFilterExpression: { username: { $type: 'string' } } },
);

UserSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

export default model<User>('User', UserSchema);

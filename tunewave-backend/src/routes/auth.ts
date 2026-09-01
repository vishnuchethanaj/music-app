import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User, { type UserDocument } from '../models/User';
import { protect, type AuthRequest } from '../middleware/auth';

const router = Router();

const registerSchema = z
  .object({
    username: z
      .string({ message: 'Username is required' })
      .trim()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be 30 characters or less'),
    email: z
      .string({ message: 'Email is required' })
      .trim()
      .toLowerCase()
      .email('Please enter a valid email address'),
    password: z
      .string({ message: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Password must include a lowercase letter')
      .regex(/[A-Z]/, 'Password must include an uppercase letter')
      .regex(/\d/, 'Password must include a number'),
    confirmPassword: z.string({ message: 'Confirm password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const loginSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address'),
  password: z.string({ message: 'Password is required' }).min(1, 'Password is required'),
});

type PublicUser = {
  _id: string;
  username: string;
  email: string;
  profileImage: string;
  isArtist: boolean;
  createdAt: Date;
};

const jwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return secret;
};

const generateToken = (id: string): string => {
  return jwt.sign({ id }, jwtSecret(), { expiresIn: '7d' });
};

const publicUser = (user: UserDocument): PublicUser => {
  return {
    _id: user.id,
    username: user.username,
    email: user.email,
    profileImage: user.profileImage,
    isArtist: user.isArtist,
    createdAt: user.createdAt,
  };
};

const duplicateKeyMessage = (error: unknown): string | null => {
  if (!error || typeof error !== 'object' || !('code' in error) || error.code !== 11000 || !('keyPattern' in error)) {
    return null;
  }

  const { keyPattern } = error;

  if (!keyPattern || typeof keyPattern !== 'object') {
    return 'An account with these details already exists';
  }

  if ('email' in keyPattern) {
    return 'An account with this email already exists';
  }

  if ('username' in keyPattern) {
    return 'This username is already taken';
  }

  return 'An account with these details already exists';
};

const validationMessage = (error: z.ZodError): string => {
  return error.issues[0]?.message || 'Invalid request data';
};

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ success: false, message: validationMessage(parsed.error) });
      return;
    }

    const { username, email, password } = parsed.data;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser?.email === email) {
      res.status(409).json({ success: false, message: 'An account with this email already exists' });
      return;
    }

    if (existingUser?.username === username) {
      res.status(409).json({ success: false, message: 'This username is already taken' });
      return;
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({
      success: true,
      token: generateToken(user.id),
      user: publicUser(user),
    });
  } catch (error) {
    const duplicateMessage = duplicateKeyMessage(error);

    if (duplicateMessage) {
      res.status(409).json({ success: false, message: duplicateMessage });
      return;
    }

    const message = error instanceof Error ? error.message : 'Registration failed';
    res.status(500).json({ success: false, message });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ success: false, message: validationMessage(parsed.error) });
      return;
    }

    const { email, password } = parsed.data;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401).json({ success: false, message: 'No account found for this email address' });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      res.status(401).json({ success: false, message: 'Incorrect password' });
      return;
    }

    res.status(200).json({
      success: true,
      token: generateToken(user.id),
      user: publicUser(user),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    res.status(500).json({ success: false, message });
  }
});

router.get('/me', protect, (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Missing authentication' });
    return;
  }

  res.status(200).json({ success: true, user: publicUser(req.user) });
});

router.post('/logout', protect, (_req: AuthRequest, res: Response): void => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export default router;

import type { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import User, { type UserDocument } from '../models/User';

export interface AuthRequest extends Request {
  user?: UserDocument;
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return secret;
};

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Missing authentication token' });
    return;
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, getJwtSecret());

    if (typeof decoded === 'string' || typeof decoded.id !== 'string') {
      res.status(401).json({ success: false, message: 'Invalid authentication token' });
      return;
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({ success: false, message: 'Authenticated user no longer exists' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({ success: false, message: 'Authentication token has expired' });
      return;
    }

    if (error instanceof JsonWebTokenError) {
      res.status(401).json({ success: false, message: 'Invalid authentication token' });
      return;
    }

    res.status(500).json({ success: false, message: 'Authentication service error' });
  }
};

export const restrictToArtist = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user?.isArtist) {
    res.status(403).json({ success: false, message: 'Access denied: Artist status required' });
    return;
  }
  next();
};

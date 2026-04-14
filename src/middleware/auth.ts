import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { JWT_SECRET } from '../config/env';

export interface AuthRequest extends Request {
  user?: any;
}

/* ========================
   AUTHENTICATE MIDDLEWARE
======================== */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    const decoded: any = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();

  } catch (err: any) {
    console.log("JWT ERROR:", err.message);

    return res.status(401).json({
      error: 'Invalid token',
      detail: err.message
    });
  }
};

/* ========================
   AUTHORIZE MIDDLEWARE
======================== */
export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    next();
  };
};
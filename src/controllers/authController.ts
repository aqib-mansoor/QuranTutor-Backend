import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    // 2. FIND USER FIRST (IMPORTANT ORDER)
    const user = await User.findOne({ email });

    console.log("USER FOUND:", user);

    // 3. CHECK USER EXISTS
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // 4. COMPARE PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // 5. JWT CHECK
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        message: 'JWT_SECRET missing',
      });
    }

    // 6. CREATE TOKEN
    const token = jwt.sign(
      { id: user._id, role: user.role },
      secret,
      { expiresIn: '7d' }
    );

    // 7. RESPONSE
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Server error',
    });
  }
};
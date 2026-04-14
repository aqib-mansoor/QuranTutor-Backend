import { Request, Response } from 'express';
import { Course } from '../models/Course.ts';
import User from '../models/User';
import { sendSuccess, sendError } from '../utils/response.ts';

export const listCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find();
    sendSuccess(res, courses);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const listTeachersSimple = async (req: Request, res: Response) => {
  try {
    const teachers = await User.find({ role: 'teacher' }, 'name _id');
    sendSuccess(res, teachers);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

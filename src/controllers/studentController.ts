import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.ts';
import  User  from '../models/User';
import { Class } from '../models/Class.ts';
import { Attendance } from '../models/Attendance.ts';
import { ProgressReport } from '../models/ProgressReport.ts';
import { Homework } from '../models/Homework.ts';
import { sendSuccess, sendError } from '../utils/response.ts';
import bcrypt from 'bcryptjs';

export const getUpcomingClasses = async (req: AuthRequest, res: Response) => {
  try {
    const classes = await Class.find({
      student_id: req.user._id,
      date: { $gte: new Date() }
    }).populate('teacher_id', 'name').populate('course_id', 'name');
    sendSuccess(res, classes);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const getAttendanceRecord = async (req: AuthRequest, res: Response) => {
  try {
    const attendances = await Attendance.find({ user_id: req.user._id, role: 'student' }).populate('class_id');
    sendSuccess(res, attendances);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const requestReschedule = async (req: AuthRequest, res: Response) => {
  try {
    const { requested_date, requested_time } = req.body;
    await Class.findByIdAndUpdate(req.params.class_id, {
      reschedule_request: {
        requested_by: req.user._id,
        requested_date: new Date(requested_date),
        requested_time,
        status: 'pending'
      }
    });
    sendSuccess(res, { status: 'pending' });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const getProgressReport = async (req: AuthRequest, res: Response) => {
  try {
    const report = await ProgressReport.findOne({ student_id: req.user._id }).sort({ date: -1 });
    sendSuccess(res, report);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const getProgressHistory = async (req: AuthRequest, res: Response) => {
  try {
    const history = await ProgressReport.find({ student_id: req.user._id }).sort({ date: 1 });
    sendSuccess(res, history);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const getHomework = async (req: AuthRequest, res: Response) => {
  try {
    const homework = await Homework.find({ student_id: req.user._id }).populate('teacher_id', 'name');
    sendSuccess(res, homework);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const markHomeworkDone = async (req: AuthRequest, res: Response) => {
  try {
    const homework = await Homework.findByIdAndUpdate(req.params.homework_id, { status: 'student_done' }, { new: true });
    sendSuccess(res, homework);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

import { Feedback } from '../models/Feedback.ts';

export const submitFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const feedback = new Feedback({
      ...req.body,
      student_id: req.user._id
    });
    await feedback.save();
    sendSuccess(res, feedback, 201);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    sendSuccess(res, user);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

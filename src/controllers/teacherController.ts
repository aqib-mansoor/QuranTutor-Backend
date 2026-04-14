import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.ts';
import User  from '../models/User';
import { Class } from '../models/Class.ts';
import { Attendance } from '../models/Attendance.ts';
import { ProgressReport } from '../models/ProgressReport.ts';
import { Homework } from '../models/Homework.ts';
import { sendSuccess, sendError } from '../utils/response.ts';
import bcrypt from 'bcryptjs';

export const getMyStudents = async (req: AuthRequest, res: Response) => {
  try {
    const students = await User.find({ teacher_id: req.user._id }, 'name current_level course_interest');
    sendSuccess(res, students);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const getMySchedule = async (req: AuthRequest, res: Response) => {
  try {
    const { start, end } = req.query;
    const query: any = { teacher_id: req.user._id };
    if (start || end) {
      query.date = {};
      if (start) query.date.$gte = new Date(start as string);
      if (end) query.date.$lte = new Date(end as string);
    }
    const classes = await Class.find(query).populate('student_id', 'name').populate('course_id', 'name');
    sendSuccess(res, classes);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const requestReschedule = async (req: AuthRequest, res: Response) => {
  try {
    const { requested_date, requested_time } = req.body;
    const c = await Class.findByIdAndUpdate(req.params.class_id, {
      reschedule_request: {
        requested_by: req.user._id,
        requested_date: new Date(requested_date),
        requested_time,
        status: 'pending'
      }
    }, { new: true });
    sendSuccess(res, { status: 'pending' });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const markStudentAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { status, notes } = req.body;
    const c: any = await Class.findById(req.params.class_id);
    if (!c || c.teacher_id.toString() !== req.user._id.toString()) {
      return sendError(res, 'Unauthorized', 403);
    }
    const attendance = await Attendance.findOneAndUpdate(
      { class_id: req.params.class_id, user_id: c.student_id, role: 'student' },
      { status, notes },
      { upsert: true, new: true }
    );
    sendSuccess(res, attendance);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    const report = new ProgressReport({
      ...req.body,
      teacher_id: req.user._id
    });
    await report.save();
    sendSuccess(res, report, 201);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const assignHomework = async (req: AuthRequest, res: Response) => {
  try {
    const homework = new Homework({
      ...req.body,
      teacher_id: req.user._id
    });
    await homework.save();
    sendSuccess(res, homework, 201);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const verifyHomework = async (req: AuthRequest, res: Response) => {
  try {
    const { verification_note } = req.body;
    const homework = await Homework.findByIdAndUpdate(req.params.homework_id, {
      status: 'verified',
      verification_note
    }, { new: true });
    sendSuccess(res, homework);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const listHomework = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const query: any = { teacher_id: req.user._id };
    if (status) query.status = status;
    const homework = await Homework.find(query).populate('student_id', 'name');
    sendSuccess(res, homework);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const getMyAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const attendances = await Attendance.find({ user_id: req.user._id, role: 'teacher' });
    const total = attendances.length;
    const present = attendances.filter(a => a.status === 'Present').length;
    const overall_percent = total > 0 ? (present / total) * 100 : 0;
    
    sendSuccess(res, {
      overall_percent,
      classes: attendances
    });
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

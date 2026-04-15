import { Request, Response } from 'express';
import User from '../models/User'; // ✅ FIXED IMPORT
import { Class } from '../models/Class.ts';
import { Attendance } from '../models/Attendance.ts';
import { ProgressReport } from '../models/ProgressReport.ts';
import { Homework } from '../models/Homework.ts';
import { TrialRequest } from '../models/TrialRequest.ts';
import { Course } from '../models/Course.ts';
import { Feedback } from '../models/Feedback.ts';
import { sendSuccess, sendError, getPagination } from '../utils/response.ts';
import bcrypt from 'bcryptjs';


export const createTeacher = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    
    // 1. HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. CREATE TEACHER WITH HASHED PASSWORD
    const teacher = new User({
      ...req.body,
      password: hashedPassword,
      role: "teacher",
    });

    await teacher.save();

    sendSuccess(res, teacher, 201);
  } catch (error: any) {
    sendError(res, error.message);
  }
};
export const listTeachers = async (req: Request, res: Response) => {
  try {
    const { skip, limit, page } = getPagination(req.query);
    const search = req.query.search as string;

    const query: any = { role: 'teacher' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const teachers = await User.find(query).skip(skip).limit(limit);
    const total = await User.countDocuments(query);

    // Add student count and attendance % (simplified for now)
    const teachersWithStats = await Promise.all(teachers.map(async (t: any) => {
      const studentCount = await User.countDocuments({ teacher_id: t._id });
      return { ...t.toObject(), studentCount, attendancePercent: 100 }; // Placeholder
    }));

    res.json({ success: true, data: teachersWithStats, total, page, limit });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const getTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await User.findById(req.params.id);
    if (!teacher) return sendError(res, 'Teacher not found', 404);
    sendSuccess(res, teacher);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    sendSuccess(res, teacher);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    sendSuccess(res, { message: 'Teacher deleted' });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const resetTeacherPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });
    sendSuccess(res, { message: 'Password reset successful' });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Student Management
export const createStudent = async (req: Request, res: Response) => {
  try {
    const student = new User({ ...req.body, role: 'student' });
    await student.save();
    sendSuccess(res, student, 201);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const listStudents = async (req: Request, res: Response) => {
  try {
    const { skip, limit, page } = getPagination(req.query);
    const search = req.query.search as string;

    const query: any = { role: 'student' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await User.find(query).populate('teacher_id', 'name').skip(skip).limit(limit);
    const total = await User.countDocuments(query);
    res.json({ success: true, data: students, total, page, limit });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const getStudent = async (req: Request, res: Response) => {
  try {
    const student = await User.findById(req.params.id).populate('teacher_id', 'name');
    if (!student) return sendError(res, 'Student not found', 404);
    sendSuccess(res, student);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const student = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    sendSuccess(res, student);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    sendSuccess(res, { message: 'Student deleted' });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const resetStudentPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });
    sendSuccess(res, { message: 'Password reset successful' });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const assignTeacher = async (req: Request, res: Response) => {
  try {
    const { teacher_id } = req.body;
    const student = await User.findByIdAndUpdate(req.params.id, { teacher_id }, { new: true });
    sendSuccess(res, student);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Class Schedule
export const createClass = async (req: Request, res: Response) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    sendSuccess(res, newClass, 201);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const bulkCreateClasses = async (req: Request, res: Response) => {
  try {
    const { student_id, teacher_id, course_id, start_date, end_date, days_of_week, time, duration_minutes, meeting_link } = req.body;
    const classes = [];
    let current = new Date(start_date);
    const end = new Date(end_date);

    const dayMap: any = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
    const targetDays = days_of_week.map((d: string) => dayMap[d]);

    while (current <= end) {
      if (targetDays.includes(current.getDay())) {
        classes.push({
          student_id, teacher_id, course_id, date: new Date(current), time, duration_minutes, meeting_link
        });
      }
      current.setDate(current.getDate() + 1);
    }

    const createdClasses = await Class.insertMany(classes);
    sendSuccess(res, createdClasses, 201);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const listClasses = async (req: Request, res: Response) => {
  try {
    const { teacher_id, student_id, start_date, end_date } = req.query;
    const query: any = {};
    if (teacher_id) query.teacher_id = teacher_id;
    if (student_id) query.student_id = student_id;
    if (start_date || end_date) {
      query.date = {};
      if (start_date) query.date.$gte = new Date(start_date as string);
      if (end_date) query.date.$lte = new Date(end_date as string);
    }
    const classes = await Class.find(query).populate('student_id', 'name').populate('teacher_id', 'name').populate('course_id', 'name');
    sendSuccess(res, classes);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const getClass = async (req: Request, res: Response) => {
  try {
    const c = await Class.findById(req.params.id).populate('student_id', 'name').populate('teacher_id', 'name').populate('course_id', 'name');
    sendSuccess(res, c);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const updateClass = async (req: Request, res: Response) => {
  try {
    const c = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    sendSuccess(res, c);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    sendSuccess(res, { message: 'Class deleted' });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Attendance
export const markStudentAttendance = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const c: any = await Class.findById(req.params.class_id);
    const attendance = await Attendance.findOneAndUpdate(
      { class_id: req.params.class_id, user_id: c.student_id, role: 'student' },
      { status },
      { upsert: true, new: true }
    );
    sendSuccess(res, attendance);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const markTeacherAttendance = async (req: Request, res: Response) => {
  try {
    const { status, late_minutes } = req.body;
    const c: any = await Class.findById(req.params.class_id);
    const attendance = await Attendance.findOneAndUpdate(
      { class_id: req.params.class_id, user_id: c.teacher_id, role: 'teacher' },
      { status, late_minutes },
      { upsert: true, new: true }
    );
    sendSuccess(res, attendance);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Progress Reports
export const listProgress = async (req: Request, res: Response) => {
  try {
    const { student_id } = req.query;
    const query: any = {};
    if (student_id) query.student_id = student_id;
    const reports = await ProgressReport.find(query).populate('student_id', 'name').populate('teacher_id', 'name');
    sendSuccess(res, reports);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const updateProgress = async (req: Request, res: Response) => {
  try {
    const report = await ProgressReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    sendSuccess(res, report);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Homework
export const listHomework = async (req: Request, res: Response) => {
  try {
    const { student_id, teacher_id } = req.query;
    const query: any = {};
    if (student_id) query.student_id = student_id;
    if (teacher_id) query.teacher_id = teacher_id;
    const homework = await Homework.find(query).populate('student_id', 'name').populate('teacher_id', 'name');
    sendSuccess(res, homework);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const deleteHomework = async (req: Request, res: Response) => {
  try {
    await Homework.findByIdAndDelete(req.params.id);
    sendSuccess(res, { message: 'Homework deleted' });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const verifyHomework = async (req: Request, res: Response) => {
  try {
    const homework = await Homework.findByIdAndUpdate(req.params.id, { status: 'verified' }, { new: true });
    sendSuccess(res, homework);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Fee Tracking
export const listFees = async (req: Request, res: Response) => {
  try {
    const students = await User.find({ role: 'student' }, 'name email fee_status fee_amount fee_due_date');
    sendSuccess(res, students);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const updateFeeStatus = async (req: Request, res: Response) => {
  try {
    const student = await User.findByIdAndUpdate(req.params.student_id, req.body, { new: true });
    sendSuccess(res, student);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Trial Requests
export const listTrialRequests = async (req: Request, res: Response) => {
  try {
    const requests = await TrialRequest.find();
    sendSuccess(res, requests);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const updateTrialStatus = async (req: Request, res: Response) => {
  try {
    const request = await TrialRequest.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    sendSuccess(res, request);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

export const convertTrialToStudent = async (req: Request, res: Response) => {
  try {
    const trial: any = await TrialRequest.findById(req.params.id);
    if (!trial) return sendError(res, 'Trial request not found', 404);

    const studentData = {
      name: req.body.name || trial.name,
      email: req.body.email || trial.email,
      phone: req.body.phone || trial.phone,
      student_type: trial.student_type,
      course_interest: trial.course_interest,
      role: 'student',
      password: 'temporaryPassword123' // Should be changed
    };

    const student = new User(studentData);
    await student.save();

    trial.status = 'converted';
    await trial.save();

    sendSuccess(res, student, 201);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Dashboard Stats
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const total_students = await User.countDocuments({ role: 'student' });
    const active_teachers = await User.countDocuments({ role: 'teacher' });
    const classes_today = await Class.countDocuments({
      date: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999)
      }
    });
    const overdue_fees_count = await User.countDocuments({ role: 'student', fee_status: 'Overdue' });

    // Attendance Trend (Last 4 weeks)
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const attendanceTrend = await Attendance.aggregate([
      {
        $lookup: {
          from: 'classes',
          localField: 'class_id',
          foreignField: '_id',
          as: 'class'
        }
      },
      { $unwind: '$class' },
      { $match: { 'class.date': { $gte: fourWeeksAgo }, role: 'student' } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-W%V", date: "$class.date" } },
          total: { $sum: 1 },
          present: {
            $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          week: "$_id",
          present_percent: {
            $cond: [
              { $eq: ["$total", 0] },
              0,
              { $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 2] }
            ]
          }
        }
      }
    ]);

    // Teacher Performance (Enhanced)
    const teacherPerformance = await User.aggregate([
      { $match: { role: 'teacher' } },
      {
        $lookup: {
          from: 'attendances',
          localField: '_id',
          foreignField: 'user_id',
          as: 'attendances'
        }
      },
      {
        $lookup: {
          from: 'classes',
          localField: '_id',
          foreignField: 'teacher_id',
          as: 'classes'
        }
      },
      {
        $lookup: {
          from: 'progressreports',
          localField: '_id',
          foreignField: 'teacher_id',
          as: 'progress'
        }
      },
      {
        $lookup: {
          from: 'feedbacks',
          localField: '_id',
          foreignField: 'teacher_id',
          as: 'feedback'
        }
      },
      {
        $project: {
          _id: 0,
          teacher_name: "$name",
          attendance_percent: {
            $let: {
              vars: {
                total: { $size: { $filter: { input: "$attendances", as: "a", cond: { $eq: ["$$a.role", "teacher"] } } } },
                present: { $size: { $filter: { input: "$attendances", as: "a", cond: { $and: [{ $eq: ["$$a.role", "teacher"] }, { $eq: ["$$a.status", "Present"] }] } } } }
              },
              in: {
                $cond: [{ $eq: ["$$total", 0] }, 0, { $round: [{ $multiply: [{ $divide: ["$$present", "$$total"] }, 100] }, 2] }]
              }
            }
          },
          classes_taught: { $size: { $filter: { input: "$classes", as: "c", cond: { $eq: ["$$c.status", "completed"] } } } },
          avg_student_progress: {
            $let: {
              vars: {
                total_reports: { $size: "$progress" },
                sum_scores: { $sum: { $map: { input: "$progress", as: "p", in: { $add: ["$$p.nazara_fluency_score", "$$p.memorization_accuracy_score"] } } } }
              },
              in: {
                $cond: [{ $eq: ["$$total_reports", 0] }, 0, { $round: [{ $divide: ["$$sum_scores", { $multiply: ["$$total_reports", 2] }] }, 2] }]
              }
            }
          },
          avg_feedback_score: {
            $let: {
              vars: {
                total_feedback: { $size: "$feedback" },
                sum_ratings: { $sum: "$feedback.rating" }
              },
              in: {
                $cond: [{ $eq: ["$$total_feedback", 0] }, 0, { $round: [{ $divide: ["$$sum_ratings", "$$total_feedback"] }, 2] }]
              }
            }
          }
        }
      }
    ]);

    sendSuccess(res, {
      total_students,
      active_teachers,
      classes_today,
      overdue_fees_count,
      attendance_trend: attendanceTrend,
      teacher_performance: teacherPerformance
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

import express from 'express';
import * as publicCtrl from '../controllers/publicController.ts';
import * as authCtrl from '../controllers/authController.ts';
import * as adminCtrl from '../controllers/adminController.ts';
import * as teacherCtrl from '../controllers/teacherController.ts';
import * as studentCtrl from '../controllers/studentController.ts';
import * as lookupCtrl from '../controllers/lookupController.ts';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/test', (req, res) => {
  res.send('API routes working');
});
// Public Endpoints
router.post('/public/trial-request', publicCtrl.submitTrialRequest);
router.post('/auth/login', authCtrl.login);

// Admin Endpoints
const adminOnly = [authenticate, authorize(['admin'])];

router.post('/admin/teachers', adminOnly, adminCtrl.createTeacher);
router.get('/admin/teachers', adminOnly, adminCtrl.listTeachers);
router.get('/admin/teachers/:id', adminOnly, adminCtrl.getTeacher);
router.put('/admin/teachers/:id', adminOnly, adminCtrl.updateTeacher);
router.delete('/admin/teachers/:id', adminOnly, adminCtrl.deleteTeacher);
router.post('/admin/teachers/:id/reset-password', adminOnly, adminCtrl.resetTeacherPassword);

router.post('/admin/students', adminOnly, adminCtrl.createStudent);
router.get('/admin/students', adminOnly, adminCtrl.listStudents);
router.get('/admin/students/:id', adminOnly, adminCtrl.getStudent);
router.put('/admin/students/:id', adminOnly, adminCtrl.updateStudent);
router.delete('/admin/students/:id', adminOnly, adminCtrl.deleteStudent);
router.post('/admin/students/:id/reset-password', adminOnly, adminCtrl.resetStudentPassword);
router.put('/admin/students/:id/assign-teacher', adminOnly, adminCtrl.assignTeacher);

router.post('/admin/classes', adminOnly, adminCtrl.createClass);
router.post('/admin/classes/bulk', adminOnly, adminCtrl.bulkCreateClasses);
router.get('/admin/classes', adminOnly, adminCtrl.listClasses);
router.get('/admin/classes/:id', adminOnly, adminCtrl.getClass);
router.put('/admin/classes/:id', adminOnly, adminCtrl.updateClass);
router.delete('/admin/classes/:id', adminOnly, adminCtrl.deleteClass);

router.put('/admin/attendance/student/:class_id', adminOnly, adminCtrl.markStudentAttendance);
router.put('/admin/attendance/teacher/:class_id', adminOnly, adminCtrl.markTeacherAttendance);

router.get('/admin/progress', adminOnly, adminCtrl.listProgress);
router.put('/admin/progress/:id', adminOnly, adminCtrl.updateProgress);

router.get('/admin/homework', adminOnly, adminCtrl.listHomework);
router.delete('/admin/homework/:id', adminOnly, adminCtrl.deleteHomework);
router.put('/admin/homework/:id/verify', adminOnly, adminCtrl.verifyHomework);

router.get('/admin/fees', adminOnly, adminCtrl.listFees);
router.put('/admin/fees/:student_id', adminOnly, adminCtrl.updateFeeStatus);

router.get('/admin/trial-requests', adminOnly, adminCtrl.listTrialRequests);
router.put('/admin/trial-requests/:id/status', adminOnly, adminCtrl.updateTrialStatus);
router.post('/admin/trial-requests/:id/convert', adminOnly, adminCtrl.convertTrialToStudent);

router.get('/admin/dashboard/stats', adminOnly, adminCtrl.getDashboardStats);

// Teacher Endpoints
const teacherOnly = [authenticate, authorize(['teacher'])];

router.get('/teacher/students', teacherOnly, teacherCtrl.getMyStudents);
router.get('/teacher/schedule', teacherOnly, teacherCtrl.getMySchedule);
router.post('/teacher/schedule/:class_id/reschedule', teacherOnly, teacherCtrl.requestReschedule);
router.put('/teacher/attendance/:class_id', teacherOnly, teacherCtrl.markStudentAttendance);
router.post('/teacher/progress', teacherOnly, teacherCtrl.updateProgress);
router.post('/teacher/homework', teacherOnly, teacherCtrl.assignHomework);
router.put('/teacher/homework/:homework_id/verify', teacherOnly, teacherCtrl.verifyHomework);
router.get('/teacher/homework', teacherOnly, teacherCtrl.listHomework);
router.get('/teacher/my-attendance', teacherOnly, teacherCtrl.getMyAttendance);
router.put('/teacher/profile', teacherOnly, teacherCtrl.updateProfile);

// Student Endpoints
const studentOnly = [authenticate, authorize(['student'])];

router.get('/student/classes/upcoming', studentOnly, studentCtrl.getUpcomingClasses);
router.get('/student/attendance', studentOnly, studentCtrl.getAttendanceRecord);
router.post('/student/classes/:class_id/reschedule', studentOnly, studentCtrl.requestReschedule);
router.get('/student/progress', studentOnly, studentCtrl.getProgressReport);
router.get('/student/progress/history', studentOnly, studentCtrl.getProgressHistory);
router.get('/student/homework', studentOnly, studentCtrl.getHomework);
router.put('/student/homework/:homework_id/mark-done', studentOnly, studentCtrl.markHomeworkDone);
router.post('/student/feedback', studentOnly, studentCtrl.submitFeedback);
router.put('/student/profile', studentOnly, studentCtrl.updateProfile);

// Shared Lookup Endpoints
router.get('/courses', authenticate, lookupCtrl.listCourses);
router.get('/teachers/list', adminOnly, lookupCtrl.listTeachersSimple);

export default router;

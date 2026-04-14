import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['student', 'teacher'], required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Rescheduled', 'Late'], required: true },
  late_minutes: { type: Number, default: 0 },
  notes: { type: String }
}, { timestamps: true });

export const Attendance = mongoose.model('Attendance', attendanceSchema);

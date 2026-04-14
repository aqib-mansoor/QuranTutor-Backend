import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration_minutes: { type: Number, default: 30 },
  meeting_link: { type: String },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'], default: 'scheduled' },
  reschedule_request: {
    requested_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    requested_date: { type: Date },
    requested_time: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
  }
}, { timestamps: true });

export const Class = mongoose.model('Class', classSchema);

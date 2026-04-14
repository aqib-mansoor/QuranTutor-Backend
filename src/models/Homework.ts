import mongoose from 'mongoose';

const homeworkSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignment_text: { type: String, required: true },
  due_date: { type: Date },
  status: { type: String, enum: ['assigned', 'student_done', 'verified'], default: 'assigned' },
  verification_note: { type: String }
}, { timestamps: true });

export const Homework = mongoose.model('Homework', homeworkSchema);

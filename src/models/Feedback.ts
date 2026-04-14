import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export const Feedback = mongoose.model('Feedback', feedbackSchema);

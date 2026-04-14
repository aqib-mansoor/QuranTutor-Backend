import mongoose from 'mongoose';

const progressReportSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  nazara_pages_read: { type: Number },
  nazara_fluency_score: { type: Number, min: 1, max: 5 },
  memorization_items: { type: String },
  memorization_accuracy_score: { type: Number, min: 1, max: 5 },
  general_feedback: { type: String }
}, { timestamps: true });

export const ProgressReport = mongoose.model('ProgressReport', progressReportSchema);

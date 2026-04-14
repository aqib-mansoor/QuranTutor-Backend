import mongoose from 'mongoose';

const trialRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  student_type: { type: String, enum: ['child', 'adult'], required: true },
  course_interest: { type: String, required: true },
  teacher_gender_pref: { type: String, enum: ['male', 'female', 'no_preference'], required: true },
  preferred_time_slots: { type: String, required: true },
  status: { type: String, enum: ['pending', 'converted', 'rejected'], default: 'pending' }
}, { timestamps: true });

export const TrialRequest = mongoose.model('TrialRequest', trialRequestSchema);

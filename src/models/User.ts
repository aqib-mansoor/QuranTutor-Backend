import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
  phone: { type: String },
  
  // Teacher specific fields
  qualification: { type: String },
  languages: { type: String },
  experience_years: { type: Number },
  gender: { type: String, enum: ['male', 'female'] },
  
  // Student specific fields
  student_type: { type: String, enum: ['child', 'adult'] },
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fee_status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
  fee_amount: { type: Number, default: 0 },
  fee_due_date: { type: Date },
  current_level: { type: String },
  course_interest: { type: String },
}, { timestamps: true });


userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model('User', userSchema);

export default User;
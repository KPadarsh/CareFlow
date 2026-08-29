import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '@/types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  password?: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// User model interface (statics can be added here if needed)
type UserModel = Model<IUserDocument>;

const UserSchema = new Schema<IUserDocument, UserModel>({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: [
      'patient',
      'receptionist',
      'nurse',
      'doctor',
      'lab_technician',
      'pathologist',
      'pharmacist',
      'billing_officer',
      'admin',
    ],
    default: 'patient',
    required: [true, 'Please specify a role'],
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'inactive'],
    default: 'active',
  },
  phone: {
    type: String,
    trim: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  address: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook: encrypt password before saving to db
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password!, salt);
});

// Instance method: compare password entered by user against stored hash
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = (mongoose.models.User as UserModel) || mongoose.model<IUserDocument, UserModel>('User', UserSchema);

export default User;

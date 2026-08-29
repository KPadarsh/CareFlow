import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctor extends Document {
  userId: mongoose.Types.ObjectId;
  specialization: string;
  department: string;
  consultationFee: number;
}

const DoctorSchema = new Schema<IDoctor>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  department: { type: String, required: true },
  consultationFee: { type: Number, required: true },
});

export default mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);

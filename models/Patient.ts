import mongoose, { Schema, Document } from 'mongoose';

export interface IPatient extends Document {
  userId: mongoose.Types.ObjectId;
  bloodGroup?: string;
  allergies?: string[];
  medicalHistory?: string[];
}

const PatientSchema = new Schema<IPatient>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bloodGroup: { type: String },
  allergies: [{ type: String }],
  medicalHistory: [{ type: String }],
});

export default mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);

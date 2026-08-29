import mongoose, { Schema, Document } from 'mongoose';

export interface IConsultation extends Document {
  appointmentId: mongoose.Types.ObjectId;
  diagnosis: string;
  notes?: string;
  date: Date;
}

const ConsultationSchema = new Schema<IConsultation>({
  appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
  diagnosis: { type: String, required: true },
  notes: { type: String },
  date: { type: Date, default: Date.now },
});

export default mongoose.models.Consultation || mongoose.model<IConsultation>('Consultation', ConsultationSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IPrescription extends Document {
  consultationId: mongoose.Types.ObjectId;
  medicines: Array<{
    medicineId: mongoose.Types.ObjectId;
    dosage: string;
    duration: string;
  }>;
  status: string;
}

const PrescriptionSchema = new Schema<IPrescription>({
  consultationId: { type: Schema.Types.ObjectId, ref: 'Consultation', required: true },
  medicines: [
    {
      medicineId: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
      dosage: { type: String, required: true },
      duration: { type: String, required: true },
    },
  ],
  status: { type: String, enum: ['pending', 'dispensed'], default: 'pending' },
});

export default mongoose.models.Prescription || mongoose.model<IPrescription>('Prescription', PrescriptionSchema);

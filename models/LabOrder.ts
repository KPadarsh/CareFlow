import mongoose, { Schema, Document } from 'mongoose';

export interface ILabOrder extends Document {
  consultationId: mongoose.Types.ObjectId;
  testName: string;
  status: string;
}

const LabOrderSchema = new Schema<ILabOrder>({
  consultationId: { type: Schema.Types.ObjectId, ref: 'Consultation', required: true },
  testName: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
});

export default mongoose.models.LabOrder || mongoose.model<ILabOrder>('LabOrder', LabOrderSchema);

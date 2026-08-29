import mongoose, { Schema, Document } from 'mongoose';

export interface ILabResult extends Document {
  labOrderId: mongoose.Types.ObjectId;
  resultData: string;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedDate?: Date;
}

const LabResultSchema = new Schema<ILabResult>({
  labOrderId: { type: Schema.Types.ObjectId, ref: 'LabOrder', required: true },
  resultData: { type: String, required: true },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  verifiedDate: { type: Date },
});

export default mongoose.models.LabResult || mongoose.model<ILabResult>('LabResult', LabResultSchema);

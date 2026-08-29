import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  invoiceId: mongoose.Types.ObjectId;
  amount: number;
  method: string;
  date: Date;
}

const PaymentSchema = new Schema<IPayment>({
  invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['cash', 'card', 'upi', 'insurance'], required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

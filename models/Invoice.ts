import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
  patientId: mongoose.Types.ObjectId;
  amount: number;
  status: string;
  dueDate: Date;
}

const InvoiceSchema = new Schema<IInvoice>({
  patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['unpaid', 'paid', 'partially_paid'], default: 'unpaid' },
  dueDate: { type: Date, required: true },
});

export default mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);

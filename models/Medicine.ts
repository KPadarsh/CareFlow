import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicine extends Document {
  name: string;
  stock: number;
  expiryDate: Date;
  price: number;
}

const MedicineSchema = new Schema<IMedicine>({
  name: { type: String, required: true, unique: true },
  stock: { type: Number, required: true, default: 0 },
  expiryDate: { type: Date, required: true },
  price: { type: Number, required: true },
});

export default mongoose.models.Medicine || mongoose.model<IMedicine>('Medicine', MedicineSchema);

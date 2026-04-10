import mongoose, { Document, Schema, Types } from "mongoose";

// كل زيارة هتبقى object فيها date + type + complaint + diagnosis + treatment + notes
interface IVisit {
  _id?: Types.ObjectId; // مهم جدًا
  date: string;
  type: "كشف" | "متابعة" | "استشارة";
  complaint?: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
}

export interface IPatient extends Document {
  name: string;
  phone: string;
  age?: number;
  gender?: "ذكر" | "أنثى";

  // 👇 دي أهم نقطة
  visits: Types.DocumentArray<IVisit>;
}
const VisitSchema = new Schema<IVisit>({
  date: { type: String, required: true },
  type: { type: String, required: true },
  complaint: { type: String, default: "" },
  diagnosis: { type: String, default: "" },
  treatment: { type: String, default: "" },
  notes: { type: String, default: "" },
});

const patientSchema = new Schema<IPatient>({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  age: { type: Number },
  gender: { type: String },
  visits: { type: [VisitSchema], default: [] }, // array of subdocuments
});

export const Patient = mongoose.model<IPatient>("Patient", patientSchema);
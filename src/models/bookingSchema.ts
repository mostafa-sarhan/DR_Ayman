import mongoose, { Schema, Document } from "mongoose";

// Interface للـ TypeScript
export interface IBooking extends Document {
  name: string;
  phone: string;
  type: "كشف" | "متابعة" | "استشارة";
  date: string;   // ISO string
  time: string;
  age?: number;    // السن اختياري
  gender?: "ذكر" | "أنثى"; // الجنس اختياري
  status?: "pending" | "confirmed" | "cancelled";
  createdAt: Date;

}

// Schema
const BookingSchema: Schema<IBooking> = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^01[0125][0-9]{8}$/.test(v);
      },
      message: (props: any) => `${props.value} رقم هاتف غير صالح!`,
    },
  },
  type: {
    type: String,
    enum: ["كشف", "متابعة", "استشارة"],
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 0,
  },
  gender: {
    type: String,
    enum: ["ذكر", "أنثى"],
  },

  // 🔥 الجديد
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Booking = mongoose.model<IBooking>("Booking", BookingSchema);
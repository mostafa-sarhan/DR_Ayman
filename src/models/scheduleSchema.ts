import mongoose, { Schema, Document } from "mongoose";

// نوع الـ Slot
interface ISlot {
  isAvailable: any;
  time: string;
  status: "available" | "closed" | "booked"; // ✅ بدل isAvailable
}

// نوع الـ Schedule Document
export interface ISchedule extends Document {
  date: string;
  slots: ISlot[];
}

// Schema للـ Slot
const slotSchema = new Schema<ISlot>({
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "closed", "booked"], // الحالات الثلاثة
    default: "available",
  },
});

// Schema للـ Schedule
const scheduleSchema = new Schema<ISchedule>({
  date: {
    type: String,
    required: true,
  },
  slots: [slotSchema],
});

// Export الموديل
export const Schedule = mongoose.model<ISchedule>(
  "Schedule",
  scheduleSchema
);
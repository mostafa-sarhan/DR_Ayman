import mongoose, { Schema, Document } from "mongoose";
// Schema للـ Slot
const slotSchema = new Schema({
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
const scheduleSchema = new Schema({
    date: {
        type: String,
        required: true,
    },
    slots: [slotSchema],
});
// Export الموديل
export const Schedule = mongoose.model("Schedule", scheduleSchema);
//# sourceMappingURL=scheduleSchema.js.map
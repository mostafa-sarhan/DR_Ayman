import mongoose, { Schema, Document } from "mongoose";
// بعد كده الـ Schema
const BookingSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ["كشف", "إعادة", "استشارة"],
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
export const Booking = mongoose.model("Booking", BookingSchema);
//# sourceMappingURL=booking.js.map
import mongoose, { Schema, Document } from "mongoose";
// Schema
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
        validate: {
            validator: function (v) {
                return /^01[0125][0-9]{8}$/.test(v);
            },
            message: (props) => `${props.value} رقم هاتف غير صالح!`,
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
export const Booking = mongoose.model("Booking", BookingSchema);
//# sourceMappingURL=bookingSchema.js.map
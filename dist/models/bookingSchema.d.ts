import mongoose, { Document } from "mongoose";
export interface IBooking extends Document {
    name: string;
    phone: string;
    type: "كشف" | "متابعة" | "استشارة";
    date: string;
    time: string;
    age?: number;
    gender?: "ذكر" | "أنثى";
    status?: "pending" | "confirmed" | "cancelled";
    createdAt: Date;
}
export declare const Booking: mongoose.Model<IBooking, {}, {}, {}, mongoose.Document<unknown, {}, IBooking, {}, mongoose.DefaultSchemaOptions> & IBooking & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBooking>;
//# sourceMappingURL=bookingSchema.d.ts.map
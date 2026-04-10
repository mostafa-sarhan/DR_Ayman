import mongoose, { Document } from "mongoose";
export interface IBooking extends Document {
    name: string;
    phone: string;
    type: "كشف" | "إعادة" | "استشارة";
    date: string;
    time: string;
    createdAt: Date;
}
export declare const Booking: mongoose.Model<IBooking, {}, {}, {}, mongoose.Document<unknown, {}, IBooking, {}, mongoose.DefaultSchemaOptions> & IBooking & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBooking>;
//# sourceMappingURL=booking.d.ts.map
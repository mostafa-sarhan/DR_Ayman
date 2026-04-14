import mongoose, { Document } from "mongoose";
interface ISlot {
    isAvailable: any;
    time: string;
    status: "available" | "closed" | "booked";
}
export interface ISchedule extends Document {
    date: string;
    slots: ISlot[];
}
export declare const Schedule: mongoose.Model<ISchedule, {}, {}, {}, mongoose.Document<unknown, {}, ISchedule, {}, mongoose.DefaultSchemaOptions> & ISchedule & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISchedule>;
export {};
//# sourceMappingURL=scheduleSchema.d.ts.map
import mongoose, { Document, Types } from "mongoose";
interface IVisit {
    _id?: Types.ObjectId;
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
    visits: Types.DocumentArray<IVisit>;
}
export declare const Patient: mongoose.Model<IPatient, {}, {}, {}, mongoose.Document<unknown, {}, IPatient, {}, mongoose.DefaultSchemaOptions> & IPatient & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IPatient>;
export {};
//# sourceMappingURL=patientSchema.d.ts.map
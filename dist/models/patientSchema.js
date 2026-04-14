import mongoose, { Document, Schema, Types } from "mongoose";
const VisitSchema = new Schema({
    date: { type: String, required: true },
    type: { type: String, required: true },
    complaint: { type: String, default: "" },
    diagnosis: { type: String, default: "" },
    treatment: { type: String, default: "" },
    notes: { type: String, default: "" },
});
const patientSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    age: { type: Number },
    gender: { type: String },
    visits: { type: [VisitSchema], default: [] }, // array of subdocuments
});
export const Patient = mongoose.model("Patient", patientSchema);
//# sourceMappingURL=patientSchema.js.map
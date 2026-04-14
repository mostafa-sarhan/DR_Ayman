// routes/patient.ts
import express from "express";
import { Patient } from "../models/patientSchema.js";
import { authMiddleware } from "../middleware/auth.js";
const router = express.Router();
// ================= Get all patients =================
router.get("/", authMiddleware, async (req, res) => {
    try {
        const patients = await Patient.find();
        const patientsWithLastVisit = patients.map((p) => {
            const sortedVisits = p.visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            return {
                _id: p._id,
                name: p.name,
                phone: p.phone,
                age: p.age,
                gender: p.gender,
                lastVisit: sortedVisits[0] ? `${sortedVisits[0].date} ${sortedVisits[0].type}` : "-",
            };
        });
        res.json({ patients: patientsWithLastVisit });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "خطأ في جلب المرضى" });
    }
});
// ================= Patient history =================
router.get("/:phone/history", authMiddleware, async (req, res) => {
    try {
        const { phone } = req.params;
        if (!phone)
            return res.status(400).json({ message: "رقم الهاتف مطلوب" });
        const patient = await Patient.findOne({ phone });
        if (!patient)
            return res.status(404).json({ message: "المريض غير موجود" });
        const sortedVisits = patient.visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        res.json({
            patient: {
                name: patient.name,
                phone: patient.phone,
                age: patient.age,
                gender: patient.gender,
                visits: sortedVisits,
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "حدث خطأ" });
    }
});
// ================= Add a new visit =================
// إضافة كشف جديد للمريض
router.post("/:phone/visit", authMiddleware, async (req, res) => {
    try {
        const { phone } = req.params;
        if (!phone)
            return res.status(400).json({ message: "رقم الهاتف مطلوب" });
        const { type, complaint, diagnosis, treatment, notes } = req.body;
        const patient = await Patient.findOne({ phone });
        if (!patient)
            return res.status(404).json({ message: "المريض غير موجود" });
        // أضف الزيارة الجديدة
        const newVisit = { date: new Date().toISOString().split("T")[0], type, complaint, diagnosis, treatment, notes };
        patient.visits.push(newVisit);
        await patient.save();
        res.status(201).json({ message: "تم إضافة الكشف", visit: newVisit });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "حدث خطأ أثناء إضافة الكشف" });
    }
});
// ================= Update a visit =================
router.patch("/:phone/visit/:visitId", authMiddleware, async (req, res) => {
    try {
        const { phone, visitId } = req.params;
        if (!phone)
            return res.status(400).json({ message: "رقم الهاتف مطلوب" });
        if (!visitId)
            return res.status(400).json({ message: "معرف الزيارة مطلوب" });
        const { date, type, notes } = req.body;
        const patient = await Patient.findOne({ phone });
        if (!patient)
            return res.status(404).json({ message: "المريض غير موجود" });
        const visit = patient.visits.id(visitId);
        if (!visit)
            return res.status(404).json({ message: "الزيارة غير موجودة" });
        if (date)
            visit.date = date;
        if (type)
            visit.type = type;
        if (notes)
            visit.notes = notes;
        await patient.save();
        res.json({ message: "تم تحديث الزيارة", visit });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "حدث خطأ أثناء تحديث الزيارة" });
    }
});
// ================= Delete a visit =================
router.delete("/:phone/visit/:visitId", authMiddleware, async (req, res) => {
    try {
        const { phone, visitId } = req.params;
        if (!phone)
            return res.status(400).json({ message: "رقم الهاتف مطلوب" });
        if (!visitId)
            return res.status(400).json({ message: "معرف الزيارة مطلوب" });
        const patient = await Patient.findOne({ phone });
        if (!patient)
            return res.status(404).json({ message: "المريض غير موجود" });
        const visit = patient.visits.id(visitId);
        if (!visit)
            return res.status(404).json({ message: "الزيارة غير موجودة" });
        visit.deleteOne();
        await patient.save();
        res.json({ message: "تم حذف الزيارة" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "حدث خطأ أثناء حذف الزيارة" });
    }
});
// ================= Add / Update Patient Note =================
// router.patch("/:phone/note", async (req, res) => {
//   try {
//     const { note } = req.body;
//     const patient = await Patient.findOneAndUpdate(
//       { phone: req.params.phone },
//       { notes: note }, // 👈 مهم: اسمها notes مش note
//       { new: true }
//     );
//     if (!patient) {
//       return res.status(404).json({ message: "المريض غير موجود" });
//     }
//     res.json({ note: patient.notes });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "خطأ أثناء تحديث الملاحظة" });
//   }
// });
export default router;
//# sourceMappingURL=patient.js.map
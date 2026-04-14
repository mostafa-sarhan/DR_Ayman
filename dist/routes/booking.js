import express from "express";
import { Booking } from "../models/bookingSchema.js";
import { Schedule } from "../models/scheduleSchema.js";
import { Patient } from "../models/patientSchema.js";
import { authMiddleware } from "../middleware/auth.js";
const router = express.Router();
// ================= Create Booking =================
router.post("/", async (req, res) => {
    try {
        const { name, phone, type, date, time, age, gender } = req.body;
        const schedule = await Schedule.findOne({ date });
        if (!schedule)
            return res.status(404).json({ message: "اليوم غير موجود" });
        const slot = schedule.slots.find((s) => s.time === time && s.status === "available");
        if (!slot)
            return res
                .status(404)
                .json({ message: "المعاد غير متاح أو غير موجود" });
        const existingBooking = await Booking.findOne({ date, time }).lean();
        if (existingBooking)
            return res
                .status(400)
                .json({ message: "هذا الموعد محجوز بالفعل" });
        // 🔥 قفل الـ slot
        slot.isAvailable = false;
        slot.status = "booked";
        await schedule.save();
        const newBooking = new Booking({
            name,
            phone,
            type,
            date,
            time,
            age,
            gender,
            status: "pending",
        });
        await newBooking.save();
        // 🔥 SOCKET: new booking
        const io = req.app.get("io");
        io.emit("new-booking", newBooking);
        // Patient handling
        let patient = await Patient.findOne({ phone });
        if (!patient) {
            patient = new Patient({
                name,
                phone,
                age,
                gender,
                visits: [],
            });
        }
        patient.visits.push({ date, type });
        await patient.save();
        res.status(201).json({
            message: "تم الحجز بنجاح",
            booking: newBooking,
        });
    }
    catch (err) {
        console.error("Booking error:", err);
        res.status(500).json({ message: "حدث خطأ أثناء الحجز" });
    }
});
// ================= Get All Bookings =================
router.get("/", async (req, res) => {
    try {
        const bookings = await Booking.find()
            .sort({ date: 1, time: 1 })
            .select("name phone type date time age gender status createdAt");
        res.json({ bookings });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "خطأ في جلب الحجوزات" });
    }
});
// ================= Confirm Booking =================
router.patch("/:id/confirm", authMiddleware, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking)
            return res.status(404).json({ message: "الحجز غير موجود" });
        booking.status = "confirmed";
        await booking.save();
        // 🔥 SOCKET: update
        const io = req.app.get("io");
        io.emit("booking-updated", booking);
        res.json({
            message: "تم تأكيد الحجز بنجاح",
            booking,
        });
    }
    catch (err) {
        console.error("Confirm error:", err);
        res.status(500).json({ message: "خطأ أثناء تأكيد الحجز" });
    }
});
// ================= Revert Confirmation =================
router.patch("/:id/revert", authMiddleware, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking)
            return res.status(404).json({ message: "الحجز غير موجود" });
        if (booking.status === "confirmed") {
            booking.status = "pending";
        }
        else {
            return res
                .status(400)
                .json({ message: "لا يمكن التراجع عن الحالة" });
        }
        await booking.save();
        // 🔥 SOCKET: update
        const io = req.app.get("io");
        io.emit("booking-updated", booking);
        res.json({
            message: "تم تحديث حالة الحجز",
            booking,
        });
    }
    catch (err) {
        console.error("Revert error:", err);
        res.status(500).json({ message: "خطأ أثناء تحديث الحالة" });
    }
});
// ================= Delete Booking =================
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking)
            return res.status(404).json({ message: "الحجز غير موجود" });
        const schedule = await Schedule.findOne({ date: booking.date });
        if (schedule) {
            const slot = schedule.slots.find((s) => s.time === booking.time);
            if (slot) {
                slot.status = "available";
                slot.isAvailable = true;
            }
            await schedule.save();
        }
        await Booking.findByIdAndDelete(req.params.id);
        // 🔥 SOCKET: delete
        const io = req.app.get("io");
        io.emit("booking-deleted", booking);
        res.json({
            message: "تم حذف الحجز نهائيًا",
        });
    }
    catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ message: "خطأ أثناء حذف الحجز" });
    }
});
export default router;
//# sourceMappingURL=booking.js.map
import express from "express";
import { Schedule } from "../models/scheduleSchema.js";
// import { authMiddleware } from "../middleware/auth.js";
const router = express.Router();
// ================= Create or Update Schedule =================
router.post("/", async (req, res) => {
    try {
        const { date, slots } = req.body;
        // إضافة status افتراضي لكل slot لو مش موجود
        const slotsWithStatus = slots.map((s) => ({
            time: s.time,
            status: s.status || "available",
        }));
        let schedule = await Schedule.findOne({ date });
        if (schedule) {
            schedule.slots = slotsWithStatus;
        }
        else {
            schedule = new Schedule({ date, slots: slotsWithStatus });
        }
        await schedule.save();
        res.json({ message: "تم إنشاء / تحديث الجدول", slots: schedule.slots });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "خطأ في إنشاء الجدول" });
    }
});
// ================= Get Schedule By Date =================
router.get("/:date", async (req, res) => {
    try {
        const { date } = req.params;
        const today = new Date().toISOString().split("T")[0] ?? "";
        if (!date || date < today) {
            return res.status(400).json({ message: "لا يمكن الوصول لأيام سابقة" });
        }
        let schedule = await Schedule.findOne({ date });
        if (!schedule) {
            const DEFAULT_TIMES = [
                "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
                "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
                "16:00", "16:30", "17:00", "17:30"
            ];
            schedule = new Schedule({
                date,
                slots: DEFAULT_TIMES.map((time) => ({
                    time,
                    status: "available",
                })),
            });
            await schedule.save();
        }
        res.json({ slots: schedule.slots });
    }
    catch (err) {
        console.error("Schedule fetch error:", err);
        res.status(500).json({ message: "خطأ في جلب الجدول" });
    }
});
// ================= Update Slot Status =================
router.patch("/:date/updateStatus", async (req, res) => {
    try {
        const { date } = req.params;
        const { time, status } = req.body; // status = available / closed
        if (!date) {
            return res.status(400).json({ message: "التاريخ مطلوب" });
        }
        const schedule = await Schedule.findOne({ date });
        if (!schedule)
            return res.status(404).json({ message: "الجدول غير موجود" });
        schedule.slots = schedule.slots.map((slot) => {
            if (slot.time === time) {
                // لو محجوز مينفعش نغيره
                if (slot.status !== "booked") {
                    slot.status = status;
                }
            }
            return slot;
        });
        await schedule.save();
        res.json({ message: "تم تحديث الحالة", slots: schedule.slots });
    }
    catch (err) {
        console.error("Error updating slot:", err);
        res.status(500).json({ message: "خطأ في تحديث الجدول" });
    }
});
export default router;
//# sourceMappingURL=schedule.js.map
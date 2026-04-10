import express from "express";
import mongoose from 'mongoose';
import { Booking } from "./models/booking.js";
const app = express();
const PORT = 3000;
app.post("/", (req, res) => {
    const newBooking = new Booking({
        name: " mohamed",
        phone: "0101234568",
        type: "كشف",
        date: "2024-07-01",
        time: "10:00"
    });
    newBooking.save();
    res.send("Hello World");
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
mongoose.connect('mongodb://127.0.0.1:27017/DrAyman')
    .then(() => console.log('Connected!'));
//# sourceMappingURL=index.js.map
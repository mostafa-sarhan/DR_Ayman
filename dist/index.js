// index.ts
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import patientRoutes from "./routes/patient.js";
import scheduleRoutes from "./routes/schedule.js";
import bookingRoutes from "./routes/booking.js";
import authRoutes from "./routes/auth.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
// ================= HTTP + Socket =================
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // ممكن نضيّقها بعدين
    },
});
// ================= Middleware =================
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://dr-ayman.vercel.app",
        "https://ayman-elgamal.vercel.app",
        "https://ayman-elgamal-git-main-mostafa-sarhans-projects.vercel.app",
        "https://ashraf-abas-11lm000ah-mostafa-sarhans-projects.vercel.app"
    ],
    credentials: true,
}));
app.use(express.json());
// ================= Socket =================
app.set("io", io);
io.on("connection", (socket) => {
    console.log("🔥 User connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
    });
});
// ================= DB =================
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected! ✅"))
    .catch((err) => console.error("Mongo Error:", err));
// ================= ROUTES =================
app.get("/", (req, res) => {
    res.send("Server is running!");
});
app.use("/patients", patientRoutes);
app.use("/schedule", scheduleRoutes);
app.use("/bookings", bookingRoutes);
app.use("/auth", authRoutes);
// ================= START =================
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map
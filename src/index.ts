// index.ts
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";

// Routes
import patientRoutes from "./routes/patient.js";
import scheduleRoutes from "./routes/schedule.js";
import bookingRoutes from "./routes/booking.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔥 Socket server
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ================= Middleware =================
app.use(cors());
app.use(express.json());

// ================= Socket =================
app.set("io", io);

io.on("connection", (socket) => {
  console.log("🔥 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ================= DB CONNECTION (FIXED) =================
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB connected! ✅"))
  .catch((err) => console.error("Mongo Error:", err));

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// ================= ROUTES =================
app.use("/patients", patientRoutes);
app.use("/schedule", scheduleRoutes);
app.use("/bookings", bookingRoutes);
app.use("/auth", authRoutes);

// ================= START SERVER =================
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
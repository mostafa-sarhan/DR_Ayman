import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router();
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    // مؤقت لحد ما تربطه بالداتابيز
    if (email !== "admin@test.com" || password !== "123456") {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ email, role: "admin" }, "SECRET_KEY", { expiresIn: "1d" });
    res.json({ token });
});
export default router;
//# sourceMappingURL=auth.js.map
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");

const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS (vite origin)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/ping", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.log("❌ Mongo connect error:", err.message);
    process.exit(1);
  });

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  message: { message: "Too many requests, please try again later" },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many login attempts, please try again later" },
});

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);
app.use(morgan("dev"));
app.use(limiter);

app.use("/api/auth", authLimiter, require("./src/routes/authRoutes"));
app.use("/api/services", require("./src/routes/serviceRoutes"));
app.use("/api/availability", require("./src/routes/availabilityRoutes"));
app.use("/api/timeoff", require("./src/routes/timeOffRoutes"));
app.use("/api/appointments", require("./src/routes/appointmentRoutes"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

// Trim env values in case of spaces around =
["MONGO_URI", "CLIENT_URL", "JWT_SECRET", "BREVO_API_KEY", "GMAIL_USER"].forEach(
  (key) => {
    if (typeof process.env[key] === "string") {
      process.env[key] = process.env[key].trim();
    }
  },
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  message: { message: "Too many requests, please try again later" },
});

const app = express();
app.set("trust proxy", 1);
app.use(
  helmet({
    // API-only server — no HTML views, so the default CSP just adds noise
    // to Thunder Client/browser devtools without protecting anything real.
    contentSecurityPolicy: false,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(limiter);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/services", require("./src/routes/serviceRoutes"));
app.use("/api/availability", require("./src/routes/availabilityRoutes"));
app.use("/api/timeoff", require("./src/routes/timeOffRoutes"));
app.use("/api/appointments", require("./src/routes/appointmentRoutes"));
app.use("/api/providers", require("./src/routes/providerRoutes"));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong. Please try again later.",
  });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set");
    process.exit(1);
  }
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not set");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

start();

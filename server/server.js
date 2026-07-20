require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/services", require("./src/routes/serviceRoutes"));
app.use("/api/availability", require("./src/routes/availabilityRoutes"));
app.use("/api/timeoff", require("./src/routes/timeOffRoutes"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

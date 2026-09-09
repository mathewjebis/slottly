const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);
appointmentSchema.index({ provider: 1, date: 1 });

// Prevents two active (non-cancelled) appointments from ever occupying the
// same provider/date/startTime, even under concurrent requests. The
// application-level "is this slot free" check in the controller can race
// between two simultaneous bookings; this index is the actual guarantee.
appointmentSchema.index(
  { provider: 1, date: 1, startTime: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["pending", "confirmed", "completed"] },
    },
  },
);

module.exports = mongoose.model("Appointment", appointmentSchema);

const mongoose = require("mongoose");

const timeOffSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    default: "",
  },
});
module.exports = mongoose.model("TimeOff", timeOffSchema);

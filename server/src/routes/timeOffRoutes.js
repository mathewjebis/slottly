const express = require("express");
const {
  addTimeOff,
  getMyTimeOff,
  deleteTimeOff,
} = require("../controllers/timeOffController");
const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, requireRole("provider"), addTimeOff);
router.get("/my-timeoff", protect, requireRole("provider"), getMyTimeOff);
router.delete("/:id", protect, requireRole("provider"), deleteTimeOff);

module.exports = router;

const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middleware/authMiddleware");
const {
  getSlots,
  createAppointment,
  getMyAppointments,
  cancelAppointment,
} = require("../controllers/appointmentController");

router.get("/available-slots", protect, getSlots);
router.post("/", protect, requireRole("customer"), createAppointment);
router.get("/my-appointments", protect, getMyAppointments);
router.patch("/:id/cancel", protect, cancelAppointment);
module.exports = router;

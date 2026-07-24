const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middleware/authMiddleware");
const {
  getSlots,
  createAppointment,
  getMyAppointments,
  cancelAppointment,
} = require("../controllers/appointmentController");

const { validateBooking } = require("../middleware/validationMiddleware");

router.get(
  "/available-slots",
  protect,
  requireRole("provider", "customer"),
  getSlots,
);
router.post(
  "/",
  protect,
  requireRole("customer"),
  validateBooking,
  createAppointment,
);
router.get("/my-appointments", protect, getMyAppointments);
router.patch("/:id/cancel", protect, cancelAppointment);

module.exports = router;

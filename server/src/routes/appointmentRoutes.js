const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middleware/authMiddleware");
const {
  getSlots,
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  confirmAppointment,
  completeAppointment,
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
router.patch(
  "/:id/confirm",
  protect,
  requireRole("provider"),
  confirmAppointment,
);
router.patch(
  "/:id/complete",
  protect,
  requireRole("provider"),
  completeAppointment,
);

module.exports = router;

const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middleware/authMiddleware");
const {
  getSlots,
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
  confirmAppointment,
  completeAppointment,
} = require("../controllers/appointmentController");

const {
  validateBooking,
  validateObjectIdParam,
} = require("../middleware/validationMiddleware");

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
router.get(
  "/:id",
  protect,
  validateObjectIdParam("id"),
  getAppointmentById,
);
router.patch(
  "/:id/cancel",
  protect,
  validateObjectIdParam("id"),
  cancelAppointment,
);
router.patch(
  "/:id/confirm",
  protect,
  requireRole("provider"),
  validateObjectIdParam("id"),
  confirmAppointment,
);
router.patch(
  "/:id/complete",
  protect,
  requireRole("provider"),
  validateObjectIdParam("id"),
  completeAppointment,
);

module.exports = router;

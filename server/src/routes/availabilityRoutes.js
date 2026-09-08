const express = require("express");
const {
  setAvailability,
  getAvailability,
} = require("../controllers/availabilityController");
const { protect, requireRole } = require("../middleware/authMiddleware");
const { validateAvailability } = require("../middleware/validationMiddleware");

const router = express.Router();

router.put(
  "/",
  protect,
  requireRole("provider"),
  validateAvailability,
  setAvailability,
);
router.get(
  "/:providerId",
  protect,
  requireRole("provider", "customer"),
  getAvailability,
);

module.exports = router;

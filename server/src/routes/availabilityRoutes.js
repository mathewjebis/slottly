const express = require("express");
const {
  setAvailability,
  getAvailability,
} = require("../controllers/availabilityController");
const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.put("/", protect, requireRole("provider"), setAvailability);
router.get(
  "/:providerId",
  protect,
  requireRole("provider", "customer"),
  getAvailability,
);

module.exports = router;

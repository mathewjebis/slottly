const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middleware/authMiddleware");
const {
  getAllProviders,
  getProviderById,
} = require("../controllers/providerController");

router.get("/", protect, requireRole("customer", "provider"), getAllProviders);
router.get(
  "/:providerId",
  protect,
  requireRole("customer", "provider"),
  getProviderById,
);

module.exports = router;

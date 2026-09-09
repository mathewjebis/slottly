const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middleware/authMiddleware");
const { validateObjectIdParam } = require("../middleware/validationMiddleware");
const {
  getAllProviders,
  getProviderById,
} = require("../controllers/providerController");

router.get("/", protect, requireRole("customer", "provider"), getAllProviders);
router.get(
  "/:providerId",
  protect,
  requireRole("customer", "provider"),
  validateObjectIdParam("providerId"),
  getProviderById,
);

module.exports = router;

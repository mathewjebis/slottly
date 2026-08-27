const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middleware/authMiddleware");

const {
  createService,
  getMyServices,
  updateService,
  deleteService,
  getProviderServices,
} = require("../controllers/serviceController");
const { validateServiceUpdate,validateService } = require("../middleware/validationMiddleware");

router.post(
  "/",
  protect,
  requireRole("provider"),
  validateService,
  createService,
);
router.get("/my-services", protect, requireRole("provider"), getMyServices);
router.put(
  "/:id",
  protect,
  requireRole("provider"),
  validateServiceUpdate,
  updateService,
);
router.delete("/:id", protect, requireRole("provider"), deleteService);
router.get(
  "/:providerId",
  protect,
  requireRole("provider", "customer"),
  getProviderServices,
);

module.exports = router;

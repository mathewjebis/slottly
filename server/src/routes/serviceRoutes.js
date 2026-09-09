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
const {
  validateServiceUpdate,
  validateService,
  validateObjectIdParam,
} = require("../middleware/validationMiddleware");

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
  validateObjectIdParam("id"),
  validateServiceUpdate,
  updateService,
);
router.delete(
  "/:id",
  protect,
  requireRole("provider"),
  validateObjectIdParam("id"),
  deleteService,
);
router.get(
  "/:providerId",
  protect,
  requireRole("provider", "customer"),
  validateObjectIdParam("providerId"),
  getProviderServices,
);

module.exports = router;

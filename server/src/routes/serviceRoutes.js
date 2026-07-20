const express = require("express");
const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

const {
  createService,
  getMyServices,
  updateService,
  deleteService,
  getProviderServices,
} = require("../controllers/serviceController");

router.post("/", protect, requireRole("provider"), createService);
router.get("/my-services", protect, requireRole("provider"), getMyServices);
router.put("/:id", protect, requireRole("provider"), updateService);
router.delete("/:id", protect, requireRole("provider"), deleteService);
router.get(
  "/:providerId",
  protect,
  requireRole("provider", "customer"),
  getProviderServices,
);

module.exports = router;

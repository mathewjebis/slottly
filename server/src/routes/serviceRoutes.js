const express = require("express");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const {
  createService,
  getMyServices,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

router.post("/", protect, createService);
router.get("/my-services", protect, getMyServices);
router.put("/:id", protect, updateService);
router.delete("/:id", protect, deleteService);

module.exports = router;

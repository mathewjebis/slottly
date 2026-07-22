const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middleware/authMiddleware");
const getSlots = require("../controllers/appointmentController");

router.get("/available-slots", protect, getSlots);

module.exports = router;

const express = require("express");
const {
  addTimeOff,
  getMyTimeOff,
  deleteTimeOff,
} = require("../controllers/timeOffController");
const { protect, requireRole } = require("../middleware/authMiddleware");
const {
  validateTimeOff,
  validateObjectIdParam,
} = require("../middleware/validationMiddleware");

const router = express.Router();

router.post("/", protect, requireRole("provider"), validateTimeOff, addTimeOff);
router.get("/", protect, requireRole("provider"), getMyTimeOff);
router.delete(
  "/:id",
  protect,
  requireRole("provider"),
  validateObjectIdParam("id"),
  deleteTimeOff,
);

module.exports = router;

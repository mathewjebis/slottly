const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateRegister = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["customer", "provider"])
    .withMessage("Role must be customer or provider"),
  validate,
];

const validateLogin = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

const validateService = [
  body("name").trim().notEmpty().withMessage("Service name is required"),
  body("duration")
    .isInt({ min: 5 })
    .withMessage("Duration must be at least 5 minutes"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  validate,
];

const validateAvailability = [
  body("weeklySchedule")
    .isArray({ min: 1 })
    .withMessage("Weekly schedule must be a non-empty array"),
  body("weeklySchedule.*.day")
    .isIn(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
    .withMessage("Invalid day"),
  body("weeklySchedule.*.startTime")
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("startTime must be in HH:MM format"),
  body("weeklySchedule.*.endTime")
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("endTime must be in HH:MM format"),
  validate,
];

const validateTimeOff = [
  body("startDate").isISO8601().withMessage("startDate must be a valid date"),
  body("endDate").isISO8601().withMessage("endDate must be a valid date"),
  validate,
];

const validateBooking = [
  body("providerId").notEmpty().withMessage("providerId is required"),
  body("serviceId").notEmpty().withMessage("serviceId is required"),
  body("date").isISO8601().withMessage("date must be a valid date"),
  body("startTime")
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("startTime must be in HH:MM format"),
  validate,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateService,
  validateAvailability,
  validateTimeOff,
  validateBooking,
};

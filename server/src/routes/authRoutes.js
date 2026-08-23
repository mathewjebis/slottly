const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many login attempts, please try again later" },
});

const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} = require("../middleware/validationMiddleware");

router.post("/register", loginLimiter, validateRegister, register);
router.post("/login", loginLimiter, validateLogin, login);

router.post("/logout", logout);
router.get("/me", protect, getMe);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/reset-password/:token", validateResetPassword, resetPassword);

module.exports = router;

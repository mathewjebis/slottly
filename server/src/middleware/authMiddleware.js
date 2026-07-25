const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  try {
    token = req.cookies.token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      return next();
    }
    return res.status(401).json({ message: "Not authorized, no token" });
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied for this role" });
    }
    next();
  };
};
module.exports = { protect, requireRole };

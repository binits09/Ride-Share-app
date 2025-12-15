const express = require("express");
const {
  registerDriver,
  getDriverStatus,
  updateDriverStatus,
} = require("../controllers/authController");

const auth = require("../middleware/authMiddleware");

const router = express.Router();

// driver registration
router.post("/register", registerDriver);

// driver status
router.get("/status", auth, getDriverStatus);
router.patch("/status", auth, updateDriverStatus);

module.exports = router;

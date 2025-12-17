const express = require("express");
const upload = require("../config/multer");
const {
  registerDriver,
  registerDriverWithPicture,
  getDriverStatus,
  updateDriverStatus,
} = require("../controllers/authController");

const {
  updateMe,
  updateEmail,
  updatePassword,
  updateVehicle,
  updateStatus,
  getStatus,
  getProfile,
  uploadProfilePicture,
} = require("../controllers/driverUpdate");

const auth = require("../middleware/authMiddleware");

const router = express.Router();

// driver registration
router.post("/register", upload.single("profilePicture"), registerDriver);

// driver status (legacy routes - keeping for compatibility)
router.get("/status", auth, getDriverStatus);
router.patch("/status", auth, updateDriverStatus);

// driver profile updates
router.put("/me", auth, updateMe);
router.put("/email", auth, updateEmail);
router.put("/password", auth, updatePassword);
router.put("/vehicle", auth, updateVehicle);

// driver status (new routes from driverUpdate)
router.get("/online-status", auth, getStatus);
router.put("/online-status", auth, updateStatus);

// driver profile
router.get("/profile", auth, getProfile);
router.post("/profile-picture", auth, upload.single("profilePicture"), uploadProfilePicture);

module.exports = router;

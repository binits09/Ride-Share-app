const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const adminCtrl = require("../controllers/adminController");

router.get("/users", protect, isAdmin, adminCtrl.getUsers);
router.get("/drivers", protect, isAdmin, adminCtrl.getDrivers);
router.get("/rides", protect, isAdmin, adminCtrl.getRides);
router.put("/block/:id", protect, isAdmin, adminCtrl.toggleBlockUser);
router.put("/block-driver/:id", protect, isAdmin, adminCtrl.toggleBlockDriver);
router.get("/driver/:driverId/rides", protect, isAdmin, adminCtrl.getDriverRides);
router.get("/help-requests", protect, isAdmin, adminCtrl.getHelpRequests);
router.put("/help-request/:id", protect, isAdmin, adminCtrl.updateHelpRequestStatus);

module.exports = router;

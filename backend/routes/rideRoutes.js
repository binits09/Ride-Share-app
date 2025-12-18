const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const rideCtrl = require("../controllers/rideController");

// USER
router.post("/request", protect, rideCtrl.requestRide);
// USER – check my latest ride status
router.get("/my", protect, rideCtrl.getMyRide);
// USER – cancel ride
router.put("/:id/cancel", protect, rideCtrl.cancelRide);



// DRIVER
router.get("/driver", protect, rideCtrl.getDriverRequests);
router.post("/claim", protect, rideCtrl.claimRide);
router.put("/:id/accept", protect, rideCtrl.acceptRide);
router.put("/:id/reject", protect, rideCtrl.rejectRide);
router.put("/:id/arrive", protect, rideCtrl.arriveRide);
router.get("/driver/summary", protect, rideCtrl.getDriverSummary);

// DRIVER lifecycle
router.put("/:id/start", protect, rideCtrl.startRide);
router.put("/:id/complete", protect, rideCtrl.completeRide);

// HISTORY
router.get("/history/user", protect, rideCtrl.getUserHistory);
router.delete("/history/user", protect, rideCtrl.deleteUserHistory);
router.get("/history/driver", protect, rideCtrl.getDriverHistory);
router.delete("/history/driver", protect, rideCtrl.deleteDriverHistory);



module.exports = router;

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

// DRIVER lifecycle
router.put("/:id/start", protect, rideCtrl.startRide);
router.put("/:id/complete", protect, rideCtrl.completeRide);


module.exports = router;

const Ride = require("../models/Ride");
const mongoose = require("mongoose");

exports.requestRide = async (req, res) => {
  try {
    const { driverId, pickup, dropoff, fare } = req.body;

    if (!pickup || !dropoff || !fare) {
      return res.status(400).json({ message: "Missing ride data" });
    }

    const ride = await Ride.create({
      user: req.user.id,
      driver: driverId || undefined,
      pickup,
      dropoff,
      fare,
      status: driverId ? "requested" : "searching",
    });

    res.status(201).json(ride);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to request ride" });
  }
};

exports.getDriverRequests = async (req, res) => {
  try {
    const rides = await Ride.find({
      $or: [
        { driver: req.user.id, status: { $in: ["requested", "accepted", "arrived", "ongoing", "completed", "paid", "cancelled"] } },
        { 
          status: "searching", 
          driver: { $exists: false },
          rejectedBy: { $ne: req.user.id }  // Exclude rides rejected by this driver
        },
      ],
    }).populate("user", "name");

    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ride requests" });
  }
};

// DRIVER CLAIM NEXT SEARCHING RIDE (assigns driver and sets to accepted)
exports.claimRide = async (req, res) => {
  try {
    let ride = await Ride.findOneAndUpdate(
      { status: "searching", driver: { $exists: false } },
      { $set: { driver: req.user.id, status: "accepted" } },
      { new: true, sort: { createdAt: 1 } }
    );

    if (!ride) {
      return res.status(404).json({ message: "No searching rides available" });
    }

    ride = await Ride.findById(ride._id).populate("user", "name");
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: "Failed to claim ride" });
  }
};

exports.acceptRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Only allow from searching or requested
    if (!["searching", "requested"].includes(ride.status)) {
      return res.status(400).json({ message: "Ride already processed" });
    }

    // If already assigned to another driver, block
    if (ride.driver && ride.driver.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Assign driver if unassigned (searching)
    if (!ride.driver) {
      ride.driver = req.user.id;
    }

    ride.status = "accepted";
    await ride.save();
    await ride.populate("user", "name");

    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: "Failed to accept ride" });
  }
};


exports.rejectRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Allow reject for both requested and searching statuses
    if (!["requested", "searching"].includes(ride.status)) {
      return res.status(400).json({ message: "Ride already processed" });
    }

    // Allow reject if driver is assigned or if it's a searching ride (no driver yet)
    if (ride.driver && ride.driver.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check if driver already rejected this ride
    if (ride.rejectedBy.includes(req.user.id)) {
      return res.status(400).json({ message: "You already rejected this ride" });
    }

    // Add driver to rejectedBy array and keep status as "searching"
    ride.rejectedBy.push(req.user.id);
    await ride.save();
    await ride.populate("user", "name");

    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: "Failed to reject ride" });
  }
};

// DRIVER ARRIVED AT PICKUP
exports.arriveRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Only assigned driver can mark arrived
    if (ride.driver?.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Allowed only after acceptance, before start
    if (ride.status !== "accepted") {
      return res.status(400).json({ message: "Ride not in accepted state" });
    }

    ride.status = "arrived";
    await ride.save();
    await ride.populate("user", "name");

    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: "Failed to mark arrived" });
  }
};

exports.getMyRide = async (req, res) => {
  try {
    const ride = await Ride.findOne({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("driver", "name profilePicture vehicleModel vehicleNumber");

    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ride" });
  }
};

// DRIVER START RIDE STATUS (sets status to 'ongoing' per model enum)
exports.startRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.driver.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!["accepted", "arrived"].includes(ride.status)) {
      return res.status(400).json({ message: "Ride not ready to start" });
    }

    // Align with model enum ('ongoing')
    ride.status = "ongoing";
    await ride.save();
    await ride.populate("user", "name");

    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: "Failed to start ride" });
  }
};

// DRIVER COMPLETE RIDE STATUS (requires 'ongoing')
exports.completeRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.driver.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (ride.status !== "ongoing") {
      return res.status(400).json({ message: "Ride not started yet" });
    }

    ride.status = "completed";
    await ride.save();
    await ride.populate("user", "name");

    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: "Failed to complete ride" });
  }
};

// USER CANCEL RIDE
exports.cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Only the user who created the ride can cancel
    if (ride.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Allowed before ride is started (searching/requested/accepted/arrived)
    if (!["searching", "requested", "accepted", "arrived"].includes(ride.status)) {
      return res.status(400).json({ message: "Ride cannot be cancelled now" });
    }

    ride.status = "cancelled";
    await ride.save();

    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel ride" });
  }
};

exports.getUserHistory = async (req, res) => {
  try {
    const rides = await Ride.find({
      user: req.user.id,
      status: { $in: ["completed", "cancelled", "paid"] },
    })
      .populate("driver", "name")
      .sort({ createdAt: -1 });

    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ride history" });
  }
};

exports.getDriverHistory = async (req, res) => {
  try {
    const rides = await Ride.find({
      driver: req.user.id,
      status: "paid",
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch driver history" });
  }
};

// DRIVER delete history (paid rides only)
exports.deleteDriverHistory = async (req, res) => {
  try {
    const { ids } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No ride ids provided" });
    }

    const result = await Ride.deleteMany({
      _id: { $in: ids },
      driver: req.user.id,
      status: "paid",
    });

    res.json({ deleted: result.deletedCount || 0 });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete ride history" });
  }
};

// DRIVER summary: total completed rides, total earnings, today's earnings
exports.getDriverSummary = async (req, res) => {
  try {
    const driverId = req.user.id;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const totalCompleted = await Ride.countDocuments({
      driver: driverId,
      status: { $in: ["completed", "paid"] },
    });

    const paidRides = await Ride.find({ driver: driverId, status: "paid" }).select("fare");
    const totalEarnings = paidRides.reduce((sum, r) => sum + (r.fare || 0), 0);

    const todayPaid = await Ride.find({ driver: driverId, status: "paid", updatedAt: { $gte: startOfToday } }).select("fare updatedAt");
    const todaysEarnings = todayPaid.reduce((sum, r) => sum + (r.fare || 0), 0);

    res.json({ totalCompleted, totalEarnings, todaysEarnings });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch driver summary" });
  }
};

// USER delete selected history entries (only non-active rides)
exports.deleteUserHistory = async (req, res) => {
  try {
    const { ids } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No ride ids provided" });
    }

    const allowedStatuses = ["completed", "cancelled", "paid"];
    const result = await Ride.deleteMany({
      _id: { $in: ids },
      user: req.user.id,
      status: { $in: allowedStatuses },
    });

    res.json({ deleted: result.deletedCount || 0 });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete ride history" });
  }
};

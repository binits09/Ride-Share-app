const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },

    pickup: {
      address: String,
      lat: Number,
      lng: Number,
    },

    dropoff: {
      address: String,
      lat: Number,
      lng: Number,
    },

    fare: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "searching",   // user looking for driver
        "requested",   // request sent to driver
        "accepted",    // driver accepted
        "rejected",    // driver rejected
        "arrived",     // driver reached pickup
        "ongoing",     // ride started
        "completed",   // ride finished
        "cancelled",   // cancelled by user/driver
      ],
      default: "requested",
    },

    rejectedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);

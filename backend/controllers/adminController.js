const User = require("../models/User");
const Driver = require("../models/Driver");
const Ride = require("../models/Ride");
const HelpRequest = require("../models/HelpRequest");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select("-password");
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch drivers" });
  }
};

exports.getRides = async (req, res) => {
  try {
    const rides = await Ride.find()
      .populate("user", "name")
      .populate("driver", "name")
      .sort({ createdAt: -1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch rides" });
  }
};

exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ message: "Status updated", isBlocked: user.isBlocked });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user status" });
  }
};

exports.toggleBlockDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    driver.isBlocked = !driver.isBlocked;
    await driver.save();
    res.json({ message: "Status updated", isBlocked: driver.isBlocked });
  } catch (err) {
    res.status(500).json({ message: "Failed to update driver status" });
  }
};

exports.getDriverRides = async (req, res) => {
  try {
    const driverId = req.params.driverId;
    const rides = await Ride.find({ driver: driverId })
      .populate("user", "name email")
      .populate("driver", "name email")
      .sort({ createdAt: -1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch driver rides" });
  }
};

exports.getHelpRequests = async (req, res) => {
  try {
    const helpRequests = await HelpRequest.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(helpRequests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch help requests" });
  }
};

exports.updateHelpRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const helpRequest = await HelpRequest.findById(req.params.id);
    if (!helpRequest) {
      return res.status(404).json({ message: "Help request not found" });
    }
    helpRequest.status = status;
    await helpRequest.save();
    res.json({ message: "Status updated", status: helpRequest.status });
  } catch (err) {
    res.status(500).json({ message: "Failed to update help request" });
  }
};

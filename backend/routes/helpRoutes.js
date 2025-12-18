const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const HelpRequest = require("../models/HelpRequest");
const User = require("../models/User");
const Driver = require("../models/Driver");

// Submit help request
router.post("/submit", protect, async (req, res) => {
  try {
    const { subject, message } = req.body;
    
    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required" });
    }

    // Determine if user is a Driver or User
    let userType = "User";
    const isDriver = await Driver.findById(req.user.id);
    if (isDriver) {
      userType = "Driver";
    }

    const helpRequest = new HelpRequest({
      user: req.user.id,
      userType,
      subject,
      message,
    });

    await helpRequest.save();
    res.status(201).json({ message: "Help request submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit help request" });
  }
});

// Get my help requests
router.get("/my-requests", protect, async (req, res) => {
  try {
    const helpRequests = await HelpRequest.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(helpRequests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch help requests" });
  }
});

module.exports = router;

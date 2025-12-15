const User = require('../models/User');
const Driver = require('../models/Driver');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register
exports.register = async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;

    if (!name || !email || !password || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailLower = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: emailLower });
    const existingDriver = await Driver.findOne({ email: emailLower });

    if (existingUser || existingDriver) {
      return res.status(400).json({ message: "Account already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email: emailLower,
      password: hashpassword,
      gender,
    });

    await user.save();

    res.status(201).json({ message: "User register success" });

  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }

    res.status(500).json({ message: "Registration failed" });
  }
};

//driver register
exports.registerDriver = async (req, res) => {
  try {
    const { name, email, password, gender, vehicleModel, vehicleNumber, licenseNumber } = req.body;

    if (!name || !email || !password || !gender || !vehicleModel || !vehicleNumber || !licenseNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailLower = email.toLowerCase().trim();

    // check both collections
    const existingUser = await User.findOne({ email: emailLower });
    const existingDriver = await Driver.findOne({ email: emailLower });

    if (existingUser || existingDriver) {
      return res.status(400).json({ message: "Account already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const driver = new Driver({
      name,
      email: emailLower,
      password: hashpassword,
      gender,
      vehicleModel,
      vehicleNumber,
      licenseNumber,
    });

    await driver.save();

    res.status(201).json({ message: "Driver registered successfully" });

  } catch (err) {
    res.status(500).json({ message: "Driver registration failed" });
  }
};



//login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const emailLower = email.toLowerCase().trim();

  try {
    let account = await User.findOne({ email: emailLower });
    let role = "user";

    if (!account) {
      account = await Driver.findOne({ email: emailLower });
      role = "driver";
    }

    if (!account) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, account.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (role === "driver" && !account.isApproved) {
      return res.status(403).json({
        message: "Driver account pending approval"
      });
    }

    if (role === "driver") {
      account.isOnline = false;
      await account.save();
    }

    const token = jwt.sign(
      { id: account._id, role, email: account.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: account._id,
        name: account.name,
        email: account.email,
        gender: account.gender,
        role,
        isApproved: role === "driver" ? account.isApproved : true,
      },
    });

  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};


// GET driver online status
exports.getDriverStatus = async (req, res) => {
  try {
    if (req.user.role !== "driver") {
      return res.status(403).json({ message: "Access denied" });
    }

    const driver = await Driver.findById(req.user.id).select("isOnline");

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json({ isOnline: driver.isOnline });
  } catch (err) {
    res.status(500).json({ message: "Failed to get driver status" });
  }
};

// UPDATE driver online status
exports.updateDriverStatus = async (req, res) => {
  try {
    if (req.user.role !== "driver") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { isOnline } = req.body;

    const driver = await Driver.findById(req.user.id);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    if (!driver.isApproved) {
      return res.status(403).json({
        message: "Driver account pending approval",
      });
    }

    driver.isOnline = isOnline;
    await driver.save();

    res.json({ isOnline: driver.isOnline });
  } catch (err) {
    res.status(500).json({ message: "Failed to update driver status" });
  }
};


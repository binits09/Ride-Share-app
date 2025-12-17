const Driver = require("../models/Driver");
const bcrypt = require("bcryptjs");

// UPDATE LOGGED-IN DRIVER PROFILE
exports.updateMe = async (req, res) => {
  try {
    const { name } = req.body;

    const driver = await Driver.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          name: name,
        },
      },
      {
        new: true,
      }
    );

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({
      _id: driver._id,
      name: driver.name,
      email: driver.email,
      role: driver.role || "driver",
      gender: driver.gender,
      vehicleModel: driver.vehicleModel,
      vehicleNumber: driver.vehicleNumber,
      licenseNumber: driver.licenseNumber,
      profilePicture: driver.profilePicture,
      isApproved: driver.isApproved,
      isOnline: driver.isOnline,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Profile update failed" });
  }
};

// UPDATE DRIVER EMAIL
exports.updateEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // check if email already exists
    const emailExists = await Driver.findOne({ email });
    if (emailExists && emailExists._id.toString() !== req.user.id) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const driver = await Driver.findByIdAndUpdate(
      req.user.id,
      { $set: { email } },
      { new: true }
    );

    res.json({
      _id: driver._id,
      name: driver.name,
      email: driver.email,
      role: driver.role || "driver",
      gender: driver.gender,
      vehicleModel: driver.vehicleModel,
      vehicleNumber: driver.vehicleNumber,
      licenseNumber: driver.licenseNumber,
      profilePicture: driver.profilePicture,
      isApproved: driver.isApproved,
      isOnline: driver.isOnline,
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to update email" });
  }
};

// UPDATE DRIVER PASSWORD
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const driver = await Driver.findById(req.user.id).select("+password");

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, driver.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    driver.password = await bcrypt.hash(newPassword, salt);

    await driver.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ message: "Password update failed" });
  }
};

// UPDATE VEHICLE DETAILS
exports.updateVehicle = async (req, res) => {
  try {
    const { vehicleModel, vehicleNumber, licenseNumber } = req.body;

    const updateData = {};
    if (vehicleModel) updateData.vehicleModel = vehicleModel;
    if (vehicleNumber) updateData.vehicleNumber = vehicleNumber;
    if (licenseNumber) updateData.licenseNumber = licenseNumber;

    const driver = await Driver.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json({
      _id: driver._id,
      name: driver.name,
      email: driver.email,
      role: driver.role || "driver",
      gender: driver.gender,
      vehicleModel: driver.vehicleModel,
      vehicleNumber: driver.vehicleNumber,
      licenseNumber: driver.licenseNumber,
      profilePicture: driver.profilePicture,
      isApproved: driver.isApproved,
      isOnline: driver.isOnline,
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to update vehicle details" });
  }
};

// UPDATE DRIVER ONLINE STATUS
exports.updateStatus = async (req, res) => {
  try {
    const { isOnline } = req.body;

    if (typeof isOnline !== "boolean") {
      return res.status(400).json({ message: "isOnline must be a boolean" });
    }

    const driver = await Driver.findByIdAndUpdate(
      req.user.id,
      { $set: { isOnline } },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json({
      _id: driver._id,
      name: driver.name,
      isOnline: driver.isOnline,
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
};

// GET DRIVER STATUS
exports.getStatus = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json({
      isOnline: driver.isOnline,
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to get status" });
  }
};

// GET COMPLETE DRIVER PROFILE
exports.getProfile = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json({
      _id: driver._id,
      name: driver.name,
      email: driver.email,
      role: driver.role || "driver",
      gender: driver.gender,
      vehicleModel: driver.vehicleModel,
      vehicleNumber: driver.vehicleNumber,
      licenseNumber: driver.licenseNumber,
      profilePicture: driver.profilePicture,
      isApproved: driver.isApproved,
      isOnline: driver.isOnline,
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// UPLOAD PROFILE PICTURE
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const profilePicturePath = `/uploads/${req.file.filename}`;

    const driver = await Driver.findByIdAndUpdate(
      req.user.id,
      { $set: { profilePicture: profilePicturePath } },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json({
      _id: driver._id,
      name: driver.name,
      email: driver.email,
      role: driver.role || "driver",
      gender: driver.gender,
      vehicleModel: driver.vehicleModel,
      vehicleNumber: driver.vehicleNumber,
      licenseNumber: driver.licenseNumber,
      profilePicture: driver.profilePicture,
      isApproved: driver.isApproved,
      isOnline: driver.isOnline,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload profile picture" });
  }
};

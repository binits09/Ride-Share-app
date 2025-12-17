const User = require("../models/User");

// UPDATE LOGGED-IN USER PROFILE
exports.updateMe = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
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

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Profile update failed" });
  }
};

exports.updateEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { email } },
      { new: true }
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to update email" });
  }
};


const bcrypt = require("bcryptjs");

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findById(req.user.id).select("+password");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ message: "Password update failed" });
  }
};


const User = require('../models/User');
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
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }


    const hashpassword = await bcrypt.hash(password, 10);


    const user = new User({
      name,
      email: emailLower,
      password: hashpassword,
      gender
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

//login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }
  const emailLower = email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email: emailLower });
    if (!user) return res.status(400).json({ message: "invalid credential" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "invalid credential" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
      }
    });
  } catch (err) {
    res.status(500).json({ message: "login failed" });
  }
};
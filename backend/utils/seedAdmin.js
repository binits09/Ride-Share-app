require('dotenv').config();
const connectdb = require('../config/db');
const User = require('../models/User');

(async () => {
  try {
    const email = process.argv[2];
    if (!email) {
      console.error('Usage: node utils/seedAdmin.js <admin-email>');
      process.exit(1);
    }
    await connectdb();
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.error('User not found for email:', email);
      process.exit(1);
    }
    user.isAdmin = true;
    await user.save();
    console.log('User promoted to admin:', user.email);
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed admin:', err.message);
    process.exit(1);
  }
})();

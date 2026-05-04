const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();
router.use(protect);

// Search users by email (for adding to projects)
router.get('/search', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.json({ success: true, users: [] });

    const users = await User.find({
      email: { $regex: email, $options: 'i' },
      _id: { $ne: req.user._id },
    }).limit(5).select('name email avatar');

    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

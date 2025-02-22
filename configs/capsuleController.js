const User = require('../models/User');

exports.createCapsule = async (req, res) => {
  try {
    const { data, unlockDate } = req.body;
    const userId = req.user._id; // Get the authenticated user's ID

    // Validate the unlock date
    if (new Date(unlockDate) <= new Date()) {
      return res.status(400).json({ message: 'Unlock date must be in the future' });
    }

    // Find the user and add the new capsule
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.capsules.push({ data, unlockDate });
    await user.save();

    res.status(201).json({ message: 'Capsule created successfully', capsule: user.capsules[user.capsules.length - 1] });
  } catch (error) {
    console.error('Error creating capsule:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


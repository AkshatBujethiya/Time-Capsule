const { User } = require('../models/User');

exports.createCapsule = async (req, res) => {
  try {
    const { capsuleName, capsuleDescription, unlockDate, lockDate, files, visibility } = req.body;
    const userId = req.user._id; // Get the authenticated user's ID

    // Validate the unlock date
    if (new Date(unlockDate) <= new Date()) {
      return res.status(400).json({ message: 'Unlock date must be in the future' });
    }

    // Validate the lock date if specified
    if (lockDate && new Date(lockDate) <= new Date()) {
      return res.status(400).json({ message: 'Lock date must be in the future' });
    }

    // Find the user and add the new capsule
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const capsule = {
      capsuleName,
      capsuleDescription,
      unlockDate,
      lockDate: lockDate || new Date(), // Set lock date to now if not specified
      files,
      visibility,
      isCommunal: visibility === 'public',
      createdAt: new Date(),
      sharedWith: []
    };

    user.capsules.push(capsule);
    await user.save();

    res.status(201).json({ message: 'Capsule created successfully', capsule: user.capsules[user.capsules.length - 1] });
  } catch (error) {
    console.error('Error creating capsule:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const User = require('../models/User');

const uploadFile = async (req, res) => {
  try {
    const { fileUrl } = req.body;
    const userId = req.user.id; // Get the user ID from the authenticated session

    // Find the user and add the file URL
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.files.push(fileUrl);
    await user.save();

    res.status(200).json({ message: 'File uploaded successfully', user });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { uploadFile };

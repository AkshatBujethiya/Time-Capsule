const { Router } = require('express');
const UploadRouter = Router();
const { cloudinary } = require('../configs/cloudinaryConfig');
const upload = require('../configs/multer');
const User = require('../models/User'); // Import the User model
const {isLoggedIn} = require('../configs/auth');

// Render the upload page
UploadRouter.get('/upload', isLoggedIn, (req, res) => {
    res.render('upload');
});

// Handle file upload
UploadRouter.post('/upload', isLoggedIn, upload.single('file'), async (req, res) => {
    try {
        // Upload the file to Cloudinary
        cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if (err) {
            console.error('Error uploading to Cloudinary:', err);
            return res.status(500).json({ message: 'Error uploading file' });
        }

        // Get the authenticated user's ID
        const userId = req.user._id;

        // Find the user and add the file URL to their profile
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.files.push(result.secure_url); // Add the Cloudinary URL to the user's files array
        await user.save();

        res.status(200).json({ message: 'File uploaded successfully', fileUrl: result.secure_url });
        });
    } catch (error) {
        console.error('Error handling file upload:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = UploadRouter;

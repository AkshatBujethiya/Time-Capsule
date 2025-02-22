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
            console.log(userId);
            // Find the user and add the file URL to their profile
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Create a new file object
            const file = {
                fileName: req.file.originalname,
                fileUrl: result.secure_url
            };
            // Create a new capsule object
            const capsule = {
                capsuleName: req.body.capsuleName,
                capsuleDescription: req.body.capsuleDescription,
                files: [file],
                unlockDate: new Date(req.body.unlockDate),
                createdAt: new Date()
            };
            // Add the capsule to the user's capsules array
            user.capsules.push(capsule);
            await user.save();
            console.log("4")
            res.status(200).json({ message: 'File uploaded successfully', fileUrl: result.secure_url });
        });
    } catch (error) {
        console.error('Error handling file upload:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = UploadRouter;

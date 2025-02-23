const { Router } = require('express');
const UploadRouter = Router();
const { cloudinary } = require('../configs/cloudinaryConfig');
const upload = require('../configs/multer');
const { User } = require('../models/User'); // Import the User model
const { isLoggedIn } = require('../configs/auth');

// Render the upload page
UploadRouter.get('/upload', isLoggedIn, (_, res) => {
    res.render('upload');
});

// Handle file upload
UploadRouter.post('/upload', isLoggedIn, upload.array('files', 10), async (req, res) => {
    try {
        const uploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload(file.path, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            fileName: file.originalname,
                            fileUrl: result.secure_url
                        });
                    }
                });
            });
        });

        const uploadedFiles = await Promise.all(uploadPromises);

        // Get the authenticated user's ID and email
        const userId = req.user._id;
        const userEmail = req.user.email;

        // Find the user and add the file URLs to their profile
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new capsule object
        const capsule = {
            capsuleName: req.body.capsuleName,
            capsuleDescription: req.body.capsuleDescription,
            files: uploadedFiles,
            unlockDate: new Date(req.body.unlockDate),
            visibility: req.body.visibility, // Store visibility attribute
            isCommunal: req.body.visibility === 'public', // Set isCommunal based on visibility
            createdAt: new Date(),
            sharedWith: [] // Initialize sharedWith as an empty array
        };
        console.log(req.body);
        // Add the capsule to the user's capsules array
        user.capsules.push(capsule);
        await user.save();

        // Get the capsule ID after saving
        const savedCapsule = user.capsules[user.capsules.length - 1];

        // Share the capsule with friends if emails are provided
        if (req.body.visibility === 'shared' && req.body.sharedEmails) {
            console.log('Shared with friends');
            const friendEmails = JSON.parse(req.body.sharedEmails).map(email => email.trim());
            for (const email of friendEmails) {
                const friend = await User.findOne({ email });
                console.log(savedCapsule._id);
                if (friend) {
                    friend.sharedCapsules.push({
                        capsuleId: savedCapsule._id,
                        capsuleName: savedCapsule.capsuleName, // Add capsule name
                        sharedBy: userEmail
                    });
                    await friend.save();
                    savedCapsule.sharedWith.push(email); // Add the friend's email to the sharedWith array
                }
            }
        }

        // Update the capsule with sharedWith information
        await user.save();

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error handling file upload:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = UploadRouter;

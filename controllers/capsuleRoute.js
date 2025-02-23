const { Router } = require('express');
const { createCapsule } = require('../configs/capsuleController');
const { isLoggedIn } = require('../configs/auth');
const { User } = require('../models/User');
const upload = require('../configs/multer');

const capsuleRouter = Router();

capsuleRouter.get('/capsules', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id; // Get the authenticated user's ID
    
        // Find the user and their capsules
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        // Separate capsules into unlocked and locked based on the unlock date and lock date
        const currentDate = new Date();
        const unlockedCapsules = user.capsules.filter(capsule => capsule.unlockDate <= currentDate && (!capsule.lockDate || capsule.lockDate <= currentDate));
        const lockedCapsules = user.capsules.filter(capsule => capsule.unlockDate > currentDate || (capsule.lockDate && capsule.lockDate > currentDate));
        
        res.render('myCapsules', { unlockedCapsules, lockedCapsules, user, username: req.user.name });
    } catch (error) {
        console.error('Error retrieving capsules:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

capsuleRouter.post('/capsules/create', isLoggedIn, async (req, res) => {
    try {
        await createCapsule(req, res);
        res.redirect('/dashboard'); // Redirect to dashboard after creation
    } catch (error) {
        console.error("Error creating capsule:", error);
        res.status(500).send("Internal Server Error");
    }
});

capsuleRouter.get('/capsule/:capsuleId', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id; // Get the authenticated user's ID
        const { capsuleId } = req.params;
    
        // Find the user and their capsule
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        // Check if the capsule exists in the user's own capsules
        let capsule = user.capsules.id(capsuleId);
    
        // If not found, check in the shared capsules
        if (!capsule) {
            const sharedUser = await User.findOne({ sharedCapsules: capsuleId });
            if (sharedUser) {
                capsule = sharedUser.capsules.id(capsuleId);
            }
        }
    
        if (!capsule) {
            return res.status(404).json({ message: 'Capsule not found' });
        }
    
        res.render('individualCapsule', { capsule: capsule, username: req.user.name });
    } catch (error) {
        console.error('Error retrieving capsule:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

capsuleRouter.post('/capsule/share', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;
        const { capsuleId, friendEmail } = req.body;

        const user = await User.findById(userId);
        const friend = await User.findOne({ email: friendEmail });

        if (!user || !friend) {
            return res.status(404).json({ message: 'User or friend not found' });
        }

        const capsule = user.capsules.id(capsuleId);
        if (!capsule) {
            return res.status(404).json({ message: 'Capsule not found' });
        }

        friend.sharedCapsules.push(capsule);
        await friend.save();

        res.redirect('/capsules');
    } catch (error) {
        console.error('Error sharing capsule:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

capsuleRouter.get('/sharedcapsule', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id; // Get the authenticated user's ID

        // Find the user and their shared capsules
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find all communal capsules
        const communalCapsules = await User.aggregate([
            { $unwind: "$capsules" },
            { $match: { "capsules.isCommunal": true } },
            { $replaceRoot: { newRoot: "$capsules" } }
        ]);

        res.render('sharedCapsules', { sharedCapsules: user.sharedCapsules, communalCapsules });
    } catch (error) {
        console.error('Error retrieving shared and communal capsules:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

capsuleRouter.get('/capsule/:email/:capsuleId', isLoggedIn, async (req, res) => {
    try {
        const { email, capsuleId } = req.params;

        // Find the user by email and populate their capsules
        const user = await User.findOne({ email }).populate('capsules');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the capsule by ID within the user's capsules
        const capsule = user.capsules.id(capsuleId);
        if (!capsule) {
            return res.status(404).json({ message: 'Capsule not found' });
        }

        res.render('individualCapsule', { capsule, username: req.user.name });
    } catch (error) {
        console.error('Error retrieving capsule:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = capsuleRouter;


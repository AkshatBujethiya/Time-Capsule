const { Router } = require('express');
const { createCapsule } = require('../configs/capsuleController');
const { isLoggedIn } = require('../configs/auth');
const User = require('../models/User');

const capsuleRouter = Router();

capsuleRouter.get('/capsules', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id; // Get the authenticated user's ID
    
        // Find the user and their capsules
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        // Separate capsules into unlocked and locked based on the unlock date
        const currentDate = new Date();
        const unlockedCapsules = user.capsules.filter(capsule => capsule.unlockDate <= currentDate);
        const lockedCapsules = user.capsules.filter(capsule => capsule.unlockDate > currentDate);
        
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
    
        const capsule = user.capsules.id(capsuleId);
        if (!capsule) {
            return res.status(404).json({ message: 'Capsule not found' });
        }
    
        res.render('individualCapsule',{capsule:capsule,username: req.user.name});
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

module.exports = capsuleRouter;


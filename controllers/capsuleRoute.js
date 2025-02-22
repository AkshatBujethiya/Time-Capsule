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
        
        console.log(unlockedCapsules, lockedCapsules);
        res.render('myCapsules', { unlockedCapsules, lockedCapsules, user });
    } catch (error) {
        console.error('Error retrieving capsules:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

capsuleRouter.post('/capsules/create', isLoggedIn, createCapsule);

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
    
        res.render('individualCapsule',{capsule:capsule});
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

module.exports = capsuleRouter;


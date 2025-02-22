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
    
        // Filter capsules that have reached their unlock date
        const currentDate = new Date();
        const unlockedCapsules = user.capsules.filter(capsule => capsule.unlockDate <= currentDate);
        
        console.log(unlockedCapsules);
        res.render('myCapsules',{unlockedCapsules:unlockedCapsules});
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
}
);

module.exports = capsuleRouter;


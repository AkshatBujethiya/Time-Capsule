const { Router } = require('express');
const FriendRouter = Router();
const User = require('../models/User');
const { isLoggedIn } = require('../configs/auth');
const { addFriend, removeFriend } = require('../configs/friendController');

FriendRouter.get('/friends', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id; // Get the authenticated user's ID

        // Find the user and their friends
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.render('friends_page', { friends: user.friends, user });
    } catch (error) {
        console.error('Error retrieving friends:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

FriendRouter.post('/friends/add', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;
        const friendEmail = req.body.friendEmail;

        const user = await User.findById(userId);
        const friend = await User.findOne({ email: friendEmail });

        if (!user || !friend) {
            return res.status(404).json({ message: 'User or friend not found' });
        }

        user.friends.push({
            googleId: friend.googleId,
            name: friend.name,
            email: friend.email
        });

        await user.save();
        res.redirect('/friends');
    } catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

FriendRouter.post('/friends/remove', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;
        const friendEmail = req.body.friendEmail;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.friends = user.friends.filter(friend => friend.email !== friendEmail);

        await user.save();
        res.redirect('/friends');
    } catch (error) {
        console.error('Error removing friend:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = FriendRouter;

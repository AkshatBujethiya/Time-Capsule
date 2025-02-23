const mongoose = require('mongoose');

const {User} = require('../models/User');
// Add a friend
const addFriend = async (req, res) => {
    const { userId, friendId } = req.body;

    try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: 'User or friend not found' });
        }

        user.friends.push({
            googleId: friend.googleId,
            name: friend.name,
            email: friend.email
        });

        await user.save();
        res.status(200).json({ message: 'Friend added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Remove a friend
const removeFriend = async (req, res) => {
    const { userId, friendId } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.friends = user.friends.filter(friend => friend.googleId !== friendId);

        await user.save();
        res.status(200).json({ message: 'Friend removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    addFriend,
    removeFriend
};

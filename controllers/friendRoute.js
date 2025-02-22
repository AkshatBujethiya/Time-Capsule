const { Router } = require("express");
const FriendRouter = Router();
const User = require("../models/User");
const { isLoggedIn } = require("../configs/auth");

// ✅ Get Friends & Pending Requests
FriendRouter.get("/friends", isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;

        // Get user details with friends & pending requests
        const user = await User.findById(userId)
            .populate("friends", "name email")
            .populate("friendRequestsSent", "name email")
            .populate("friendRequestsReceived", "name email");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.render("friends_page", {
            friends: user.friends,
            pendingRequests: user.friendRequestsReceived,
            user,
        });
    } catch (error) {
        console.error("Error retrieving friends:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Send Friend Request
FriendRouter.post("/friends/request", isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;
        const friendEmail = req.body.friendEmail;

        const user = await User.findById(userId);
        const friend = await User.findOne({ email: friendEmail });

        if (!user || !friend) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prevent duplicate requests or existing friendships
        if (user.friends.includes(friend._id) || user.friendRequestsSent.includes(friend._id)) {
            return res.status(400).json({ message: "Friend request already sent or already a friend" });
        }

        // Add to friend request lists
        user.friendRequestsSent.push(friend._id);
        friend.friendRequestsReceived.push(user._id);

        await user.save();
        await friend.save();

        res.redirect("/friends");
    } catch (error) {
        console.error("Error sending friend request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Accept Friend Request
FriendRouter.post("/friends/accept", isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;
        const friendId = req.body.friendId;

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: "User not found" });
        }

        // Add to friends list
        user.friends.push(friend._id);
        friend.friends.push(user._id);

        // Remove from pending lists
        user.friendRequestsReceived = user.friendRequestsReceived.filter(id => id.toString() !== friendId);
        friend.friendRequestsSent = friend.friendRequestsSent.filter(id => id.toString() !== user._id);

        await user.save();
        await friend.save();

        res.redirect("/friends");
    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Reject Friend Request
FriendRouter.post("/friends/reject", isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;
        const friendId = req.body.friendId;

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove from pending requests
        user.friendRequestsReceived = user.friendRequestsReceived.filter(id => id.toString() !== friendId);
        friend.friendRequestsSent = friend.friendRequestsSent.filter(id => id.toString() !== user._id);

        await user.save();
        await friend.save();

        res.redirect("/friends");
    } catch (error) {
        console.error("Error rejecting friend request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Remove Friend
FriendRouter.post("/friends/remove", isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;
        const friendId = req.body.friendId;

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove friend from both users
        user.friends = user.friends.filter(id => id.toString() !== friendId);
        friend.friends = friend.friends.filter(id => id.toString() !== user._id);

        await user.save();
        await friend.save();

        res.redirect("/friends");
    } catch (error) {
        console.error("Error removing friend:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = FriendRouter;

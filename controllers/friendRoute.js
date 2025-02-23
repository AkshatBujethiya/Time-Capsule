const { Router } = require("express");
const FriendRouter = Router();
const {User} = require("../models/User");
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
            username: req.user.name,
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

FriendRouter.post("/friends/accept", isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;
        const friendId = req.body.friendId;

        if (!friendId) {
            return res.status(400).json({ message: "Friend ID is required" });
        }

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure arrays are initialized
        if (!user.friends) user.friends = [];
        if (!friend.friends) friend.friends = [];
        if (!user.friendRequestsReceived) user.friendRequestsReceived = [];
        if (!friend.friendRequestsSent) friend.friendRequestsSent = [];

        // ✅ Push the full friend object as required by the schema
        const userFriendData = {
            googleId: friend.googleId,
            name: friend.name,
            email: friend.email
        };

        const friendUserData = {
            googleId: user.googleId,
            name: user.name,
            email: user.email
        };

        // Avoid duplicates before adding
        if (!user.friends.some(f => f.googleId === friend.googleId)) {
            user.friends.push(userFriendData);
        }
        if (!friend.friends.some(f => f.googleId === user.googleId)) {
            friend.friends.push(friendUserData);
        }

        // Remove from pending lists
        user.friendRequestsReceived = user.friendRequestsReceived.filter(id => id.toString() !== friendId);
        friend.friendRequestsSent = friend.friendRequestsSent.filter(id => id.toString() !== userId);

        await user.save();
        await friend.save();

        console.log("Friend request accepted successfully!");

        res.redirect("/friends");
    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
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

FriendRouter.post("/friends/remove", isLoggedIn, async (req, res) => {
    try {
        console.log("✅ Remove Friend Request Received");
        console.log("🟢 Request Body:", req.body);

        const userId = req.user._id;
        const friendId = req.body.friendId;

        if (!friendId) {
            console.error("❌ Friend ID is missing in the request!");
            return res.status(400).json({ message: "Friend ID is required" });
        }

        console.log(`🔍 Searching for User ID: ${userId}, Friend ID: ${friendId}`);

        const user = await User.findById(userId);
        const friend = user.friends.find(f => f._id == friendId);
        console.log(user.friends)

        if (!user) {
            console.error(`❌ User with ID ${userId} not found in the database!`);
            return res.status(404).json({ message: "User not found" });
        }

        if (!friend) {
            console.error(`❌ Friend with ID ${friendId} not found in the database!`);
            return res.status(404).json({ message: "Friend not found" });
        }

        console.log("🟢 User found:", user);
        console.log("🟢 Friend found:", friend);

        // Remove friend from both users
        user.friends = user.friends.filter(f => f.googleId !== friend.googleId);
        const friendID = await User.find({googleId : friend.googleId});
        console.log(friendID[0].friends)
        friendID.friends = friendID[0].friends.filter(f => f.googleID !== user.googleId);

        await user.save();
        await friend.save();

        console.log("✅ Friend removed successfully!");
        res.redirect("/friends");
    } catch (error) {
        console.error("❌ Error removing friend:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


module.exports = FriendRouter;

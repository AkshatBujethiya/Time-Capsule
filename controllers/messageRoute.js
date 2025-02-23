const express = require("express");
const router = express.Router();
const { User, Message } = require("../models/User"); 
// ✅ Fetch Messages Based on Google ID
router.get("/message/:friendGoogleId", async (req, res) => {
    try {
        if (!req.user) return res.redirect("/login"); // Ensure user is logged in

        const friendGoogleId = req.params.friendGoogleId;

        // Find the friend using Google ID
        const friend = await User.findOne({ googleId: friendGoogleId });
        if (!friend) {
            console.log("Friend not found in DB");
            return res.status(404).send("Friend not found");
        }

        // ✅ Check if they are friends using Google ID
        const isFriend = req.user.friends.some(f => f.googleId === friendGoogleId);
        if (!isFriend) {
            return res.status(403).send("You are not friends with this user.");
        }

        // Fetch messages between users
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: friend._id },
                { sender: friend._id, receiver: req.user._id }
            ]
        }).sort({ timestamp: 1 });
        const friends = await User.findById(req.user._id);
        res.render("message", { user: req.user, friend,friends:friends.friends, messages });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Send Message Without Socket.io
router.post("/message/:friendGoogleId", async (req, res) => {
    try {
        if (!req.user) return res.redirect("/login"); // Ensure user is logged in

        const senderId = req.user._id; // User sending the message
        const friendGoogleId = req.params.friendGoogleId;
        const { text } = req.body;

        if (!text) {
            return res.status(400).send("Message content is required.");
        }

        // ✅ Find the receiver using Google ID
        const receiver = await User.findOne({ googleId: friendGoogleId });
        if (!receiver) {
            return res.status(404).send("Receiver not found");
        }

        // ✅ Ensure they are friends
        const isFriend = req.user.friends.some(f => f.googleId === friendGoogleId);
        if (!isFriend) {
            return res.status(403).send("You are not friends with this user.");
        }

        // ✅ Save message in the database
        await Message.create({
            sender: senderId,
            receiver: receiver._id,
            text
        });
        const userId = req.user._id;

        // Get user details with friends & pending requests
        const user = await User.findById(userId)

        // ✅ Redirect back to chat page
        res.redirect(`/message/${friendGoogleId}`);
        console.log(user)

    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).send("Internal Server Error");
        
    }
});


module.exports = router;


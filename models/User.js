const mongoose = require('mongoose');

const capsuleSchema = new mongoose.Schema({
    data: { type: String, required: true }, // Could be a file URL, text, or JSON
    unlockDate: { type: Date, required: true }, // Date when the capsule should be unlocked
    createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String }, // URL to the user's profile picture
    capsules: [capsuleSchema], // Array of file URLs (e.g., Cloudinary URLs)
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

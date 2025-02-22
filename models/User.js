const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true } // URL to the file (e.g., Cloudinary URL)
});

const capsuleSchema = new mongoose.Schema({
    capsuleName: { type: String, required: true },
    capsuleDescription: { type: String, required: false },
    files: [fileSchema], // Array of files
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

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
    lockDate: { type: Date, required: false }, // Optional lock date
    createdAt: { type: Date, default: Date.now },
    isCommunal: { type: Boolean, default: false }, // Indicates if the capsule is communal
    visibility: { type: String, enum: ['private', 'shared', 'public'], default: 'private' }, // Visibility of the capsule
    sharedWith: [{ type: String, required: false }], // Array of email IDs with whom the capsule is shared
});

const friendSchema = new mongoose.Schema({
    googleId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
});

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Sender User
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Receiver User
    text: { type: String, required: true }, // Message Content
    timestamp: { type: Date, default: Date.now } // Message Timestamp
});



const sharedCapsuleSchema = new mongoose.Schema({
    capsuleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Capsule', required: true },
    capsuleName: { type: String, required: true },
    sharedBy: { type: String, required: true },
    unlockDate: { type: Date, required: true }, // Add unlockDate field
    lockDate: { type: Date, required: false } // Add lockDate field
});

const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true , index: true  },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String }, // URL to the user's profile picture
    capsules: [capsuleSchema], // Array of capsules
    friends: [friendSchema], // Array of friends
    createdAt: { type: Date, default: Date.now },
    sharedCapsules: [sharedCapsuleSchema], // Array of shared capsule objects
    friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

const User = mongoose.model('User', userSchema);
const Capsule = mongoose.model("Capsule", capsuleSchema);
const Message = mongoose.model("Message", messageSchema);

module.exports ={ User,Message };

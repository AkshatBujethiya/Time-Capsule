const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const http = require('http'); // Required for socket.io
const { Server } = require('socket.io'); // Import socket.io
const express_session = require('express-session');
const passport = require('passport');
const importdb = require('./configs/db');
require('./configs/auth');

// Initialize express
const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
    cors: {
        origin: "*", // Change this in production to your frontend URL
        methods: ["GET", "POST"]
    }
});

// Connect to database
importdb();

// Set-up express session
app.use(express_session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

const path = require('path');
const cors = require('cors');
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set-up view engine
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Cloudinary setup
const cloudinary = require('cloudinary').v2;

(async function () {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
    });
})();

// Routes
const AuthRouter = require('./controllers/authRoute');
const HomeRouter = require('./controllers/home');
const UploadRouter = require('./controllers/uploadRoute');
const UserRouter = require('./controllers/userRoutes');
const CapsuleRouter = require('./controllers/capsuleRoute');
const FriendRouter = require('./controllers/friendRoute');
const MessageRouter = require('./controllers/messageRoute'); // 🔹 Added Message Route

app.use('/', UserRouter);
app.use('/', AuthRouter);
app.use('/', HomeRouter);
app.use('/', UploadRouter);
app.use('/', CapsuleRouter);
app.use('/', FriendRouter);
app.use('/', MessageRouter); // 🔹 Added Message Route

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join room based on userId (for direct messaging)
    socket.on('joinRoom', (userId) => {
        socket.join(userId);
        console.log(`User joined room: ${userId}`);
    });

    // Listen for new messages
    socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
        try {
            // Save message to database
            const newMessage = new message({ sender: senderId, receiver: receiverId, message });
            await newMessage.save();

            // Send message to receiver in real-time
            io.to(receiverId).emit('newMessage', newMessage);
        } catch (error) {
            console.error(error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, io };

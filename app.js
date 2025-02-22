const dotenv = require('dotenv')
dotenv.config();
const express = require('express')
const express_session = require('express-session');
const passport = require('passport');
const importdb = require('./db');
require('./auth');


// Initialize express
const app=express();

// Connect to database
importdb();

//Set-up express session
app.use(express_session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());

const path = require('path');
const cors=require('cors')
app.use(cors());

// Set-up view engine
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Cloudinary setup
const cloudinary = require('cloudinary').v2;

(async function() {

    // Configuration
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

app.use('/', UserRouter);
app.use('/', AuthRouter);
app.use('/', HomeRouter);
app.use('/', UploadRouter);
app.use('/', CapsuleRouter);


app.listen(process.env.PORT,()=>{
    console.log(`server is running at port ${process.env.PORT}`)
});


module.exports = app;

const dotenv=require('dotenv')
dotenv.config();
const express=require('express')
const express_session=require('express-session');
const passport=require('passport');
require('./auth');


// Initialize express
const app=express();

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



// Routes
// const AuthRouter = require('./Controllers/auth');
// const HomeRouter = require('./Controllers/home');
// app.use('/', AuthRouter);
// app.use('/', HomeRouter);




app.get('/', (req, res) =>{
    res.render('home');
})

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/story',(req,res)=>{
    res.render('story')
})

app.get('/contact',(req,res)=>{
    res.render('contact')
})

app.get('/profile',(req,res)=>{
    res.render('profile')
})

app.get('/myaccount',(req,res)=>{
    res.render('myaccount')
})

app.get('/capsule',(req,res)=>{
    res.render('capsule')
})

const AuthRouter = require('./controllers/authRoute');
const HomeRouter = require('./controllers/home');
app.use('/', AuthRouter);
app.use('/', HomeRouter);


app.listen(process.env.PORT,()=>{
    console.log(`server is running at port ${process.env.PORT}`)
});


module.exports = app;

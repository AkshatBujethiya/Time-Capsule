const dotenv=require('dotenv')
dotenv.config();
const express=require('express')
const app=express();
const path = require('path');
const cors=require('cors')
app.use(cors());

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



app.listen(process.env.PORT,()=>{
    console.log(`server is running at port ${process.env.PORT}`)
});


module.exports=app;

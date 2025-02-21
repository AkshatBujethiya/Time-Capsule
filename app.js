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




app.get("/",(req,res)=>{
    res.send("hello world")

})

app.get('/login', (req, res) => {
    res.render('home')
});

module.exports=app;
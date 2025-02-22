const {Router} = require('express');
const HomeRouter = Router();
const { isLoggedIn } = require('../configs/auth');

HomeRouter.get("/",(req,res)=>{
    res.render('home');
});

HomeRouter.get("/dashboard", isLoggedIn, (req,res)=>{
    res.render(`dashboard`);
});

HomeRouter.get("/myaccount", isLoggedIn, (req,res)=>{
    res.render(`myaccount`);
});

module.exports=HomeRouter;

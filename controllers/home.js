const {Router} = require('express');
const HomeRouter = Router();
const { isLoggedIn } = require('../configs/auth');

HomeRouter.get("/",(req,res)=>{
    res.render('home');
});

HomeRouter.get("/about", isLoggedIn, (req,res)=>{
    res.send(`hello ${req.user.displayName}`);
});

module.exports=HomeRouter;

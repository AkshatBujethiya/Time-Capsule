const {Router} = require('express');
const HomeRouter = Router();

HomeRouter.get("/",(req,res)=>{
    res.render('home');
});

module.exports=HomeRouter;

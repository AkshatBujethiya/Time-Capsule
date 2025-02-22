const {Router} = require('express');
const HomeRouter = Router();
const { isLoggedIn } = require('../configs/auth');


HomeRouter.get("/",(req,res)=>{
    res.render('home');
});

HomeRouter.get("/dashboard", isLoggedIn, (req,res)=>{
    res.render(`dashboard`);
});

HomeRouter.get("/contact", (req,res)=>{
    res.render(`contact`);
});

HomeRouter.get("/myaccount", isLoggedIn, (req, res) => {
    res.render('myaccount', { 
        useremail: req.user.email, 
        username: req.user.name, 
        useravatar: req.user.avatar 
    });
});

HomeRouter.get("/capsule", isLoggedIn, async (req, res) => {
    try {
        const capsule = await Capsule.findById(req.params.id);
        if (!capsule) {
            return res.status(404).send("Capsule not found");
        }

        res.render("capsule", {
            capsulename: capsule.capsuleName,
            capsuledescription: capsule.capsuleDescription,
            capsulesfiles: capsule.files,
            capsuleunlockdate: capsule.unlockDate,
            capsulecreatedate: capsule.createdAt,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


module.exports=HomeRouter;

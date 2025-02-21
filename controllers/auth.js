const {Router} = require('express');
const AuthRouter = Router();

AuthRouter.get('/login', (req, res) => {
    res.send("hello world");
});

module.exports=AuthRouter;

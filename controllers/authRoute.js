const {Router} = require('express');
const passport = require('passport');
const AuthRouter = Router();

AuthRouter.get('/login', (req, res) => {
    res.render('login');
});

AuthRouter.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

AuthRouter.get('/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/google/failure'
}));

AuthRouter.get('/auth/google/failure', (req, res) => {
    res.send('Failed to authenticate..');
});

AuthRouter.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log(err);
        }
    });
    res.redirect('/');
    
});

module.exports=AuthRouter;

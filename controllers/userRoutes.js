const { Router } = require('express');
const { getUserData } = require('../configs/userController');
const { isLoggedIn } = require('../configs/auth');

const Userrouter = Router();

Userrouter.get('/profile',isLoggedIn, getUserData);

module.exports = Userrouter;

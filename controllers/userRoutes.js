const { Router } = require('express');
const { getUserData } = require('../userController');
const { isLoggedIn } = require('../auth');

const Userrouter = Router();

Userrouter.get('/profile',isLoggedIn, getUserData);

module.exports = Userrouter;

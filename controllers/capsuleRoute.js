const { Router } = require('express');
const { createCapsule, getCapsules } = require('../configs/capsuleController');
const { isLoggedIn } = require('../configs/auth');

const capsuleRouter = Router();

capsuleRouter.get('/capsules', isLoggedIn, getCapsules);
capsuleRouter.post('/capsules/create', isLoggedIn, createCapsule);

module.exports = capsuleRouter;


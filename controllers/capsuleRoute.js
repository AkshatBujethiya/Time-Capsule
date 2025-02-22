const { Router } = require('express');
const { createCapsule, getCapsules } = require('../capsuleController');
const { isLoggedIn } = require('../auth');

const capsuleRouter = Router();

capsuleRouter.get('/capsules', isLoggedIn, getCapsules);
capsuleRouter.post('/capsules/create', isLoggedIn, createCapsule);

module.exports = capsuleRouter;


const Authentication = require('../auth');
const express = require('express');

const authRouter = express.Router();

authRouter.get('/', async (req, res) => {

    const tempRandom = Math.random();

    const newToken = Authentication.generateToken(tempRandom);

    res.send(newToken);
});

module.exports = authRouter;
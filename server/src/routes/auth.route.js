const Authentication = require('../auth');
const express = require('express');

const authRouter = express.Router();

//TODO: Aggiungere sistema di login

authRouter.get('/', async (req, res) => {

    const tempRandom = Math.random();

    const newToken = Authentication.generateToken(tempRandom);

    res.json({
        token: newToken,
    });
});

module.exports = authRouter;

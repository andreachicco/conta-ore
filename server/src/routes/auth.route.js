const express = require('express');

const Authentication = require('../auth');
const dataBase = require('../dataBase');
const STATUS_CODES = require('../statusCodes');

const { checkIfAdmin } = require('../middlewares/auth.midlleware');

const authRouter = express.Router();
//!
authRouter.post('/register', /*checkIfAdmin,*/ async (req, res) => {
    const { username, privileges, password } = req.body;

    const user = {
        username: username,
        privileges: privileges,
        password: await Authentication.hashPassword(password)
    };

    try {
        await dataBase.insertUser(user);
        res.sendStatus(STATUS_CODES.OK);
    }
    catch(error) {
        console.log('Errore in fase di registrazione', error);
        res.sendStatus(STATUS_CODES.BAD_REQUEST);
    }
});

authRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = {
        username: username,
        password: password
    };

    const selectedUser = await Authentication.verifyUser(user);

    switch(selectedUser) {
        case STATUS_CODES.BAD_REQUEST: 
            res.sendStatus(STATUS_CODES.BAD_REQUEST);
            break;
        case STATUS_CODES.UNAUTHORIZED:
            res.sendStatus(STATUS_CODES.UNAUTHORIZED);
            break;
        case STATUS_CODES.NOT_FOUND:
            res.sendStatus(STATUS_CODES.NOT_FOUND);
            break;
        default:
            const token = Authentication.generateToken(selectedUser.username);
            res.status(STATUS_CODES.OK).json({ token: token });
    }
    
});

module.exports = authRouter;

const Authentication = require('../auth');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if(token === null) res.sendStatus(401);

    Authentication.authenticateToken(token, req, res, next);
}

module.exports = {
    authenticateToken
}
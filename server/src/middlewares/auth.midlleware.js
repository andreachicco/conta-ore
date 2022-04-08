const Authentication = require('../auth');
const database = require('../dataBase');
const STATUS_CODES = require('../statusCodes');

const authenticateToken = async(req, res, next) => {
    const token = req.headers['authorization'];

    if(token === null) res.sendStatus(STATUS_CODES.UNAUTHORIZED);

    const tokenData = await Authentication.getTokenData(token);

    const isValidUser = await database.getUser(tokenData);

    if(isValidUser) {
        const newLog = {
            ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            user: isValidUser.username,
            request_type: req.method,
        }

        await database.insertLog(newLog);
        
        next();
    }
    else return res.sendStatus(STATUS_CODES.UNAUTHORIZED);
}

module.exports = {
    authenticateToken
}
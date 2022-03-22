const jwt = require('jsonwebtoken');

const STATUS_CODES = require('./statusCodes');

class Authentication {

    static getSecretKey() {
        return process.env.SECRETKEY;
    }

    static generateToken(data) {
        return jwt.sign(data, this.getSecretKey());
    }

    static authenticateToken(token, req, res, next) {
        jwt.verify(token, this.getSecretKey(), (err) => {

            if(err) {
                //Il token inserito non è valido -> Non Autorizzato
                console.error('Errore durante verifica token. ', err);
                return res.sendStatus(STATUS_CODES.UNAUTHORIZED);
            }

            next();
        });
    }
}

module.exports = Authentication;
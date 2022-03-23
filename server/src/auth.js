const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const STATUS_CODES = require('./statusCodes');

class Authentication {

    
    static async hashPassword(password) {
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        
        return hash;
    }

    static async checkPassword(password, hash) {
        const compared = await bcrypt.compare(password, hash);
        return compared;
    }

    static getSecretKey() {
        return process.env.SECRETKEY;
    }

    static generateToken(username) {
        return jwt.sign(username, this.getSecretKey());
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
const jwt = require('jsonwebtoken');

class Authentication {

    static getSecretKey() {
        return process.env.SECRETKEY;
    }

    static generateToken(ipAddress) {
        return jwt.sign(ipAddress, this.getSecretKey());
    }

    static authenticateToken(token, req, res, next) {
        jwt.verify(token, this.getSecretKey(), (err, ipAddress) => {
            if(err) {
                console.error('Errore durante verifica token. ', err);
                return res.sendStatus(401);
            }

            next();
        });
    }
}

module.exports = Authentication;
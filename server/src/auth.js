const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const STATUS_CODES = require('./statusCodes');
const dataBase = require('./dataBase');

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

    static async getTokenData(token) {
        const tokenData = jwt.verify(token, this.getSecretKey());
        return tokenData;
    }
}

module.exports = Authentication;
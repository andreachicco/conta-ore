const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const STATUS_CODES = require('./statusCodes');
const dataBase = require('./dataBase');

class Authentication {

    static async verifyUser(user) {

        const selectedUser = await dataBase.getUser(user.username);

        if(selectedUser) {
            try {
                const compared = await this.checkPassword(user.password, selectedUser.password);
    
                if(compared) return selectedUser;
                else return STATUS_CODES.UNAUTHORIZED;
            } catch (error) {
                return STATUS_CODES.BAD_REQUEST;
            }
        }
        else return STATUS_CODES.NOT_FOUND;
    }
    
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
        try {
            const tokenData = jwt.verify(token, this.getSecretKey());
            return tokenData;
        } catch (error) {
            return STATUS_CODES.UNAUTHORIZED;
        }
    }
}

module.exports = Authentication;

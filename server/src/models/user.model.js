const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: 'string',
        required: true
    },
    privileges: {
        type: 'string',
        required: true,
        default: 'user'
    },
    password: {
        type: 'string',
        required: true
    }
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
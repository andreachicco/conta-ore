const mongoose = require('mongoose');

const { Schema } = mongoose;

const logSchema = new Schema({
    ip_address: 'string',
    user: 'string',
    request_type: 'string',
    request_path: 'string',
    request_date: {
        type: Date,
        default: Date.now
    }
});

const logModel = mongoose.model('log', logSchema);

module.exports = logModel;
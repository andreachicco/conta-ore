const mongoose = require('mongoose');

const { Schema } = mongoose;

const shiftSchema = new Schema({
    number: {
        type: 'number',
        required: true
    },
    type: {
        type: 'string',
        required: true
    },
    from: {
        type: 'string',
        required: true
    },
    to: {
        type: 'string',
        required: true
    }
});

const shiftModel = mongoose.model('Shift', shiftSchema);

module.exports = shiftModel;
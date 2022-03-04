const mongoose = require('mongoose');

const { Schema } = mongoose;

const daySchema = new Schema({
    day_index: {
        type: Number,
        required: true
    },
    day_name: {
        type: String,
        required: true
    },
    hours: {
        type: Number,
        default: 0
    }
});

const monthSchema = new Schema({
    month_index: {
        type: Number,
        required: true
    },
    month_name: {
        type: String,
        required: true
    },
    days: [daySchema]
});

const yearSchema = new Schema({
    year: {
        type: Number,
        required: true
    },
    months: [monthSchema]
});

const yearModel = mongoose.model('Year', yearSchema);

module.exports = yearModel;
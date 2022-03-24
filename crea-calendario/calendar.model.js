const mongoose = require('mongoose');

const { Schema } = mongoose;

const extraordinarySchema = new Schema({
    number: {
        type: Number,
        default: 0
    },
    from: {
        type: Number,
        default: 0,
    },
    to: {
        type: Number,
        default: 0
    },
    total_hours: {
        type: Number,
        default: 0
    }
})

const daySchema = new Schema({
    index: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    extraordinary: extraordinarySchema
});

const monthSchema = new Schema({
    index: {
        type: Number,
        required: true
    },
    name: {
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
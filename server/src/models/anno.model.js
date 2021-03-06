const mongoose = require('mongoose');

const { Schema } = mongoose;

const extraordinarySchema = new Schema({
    number: {
        type: Number,
        default: 0
    },
    type: String,
    from: {
        type: String,
        default: 0,
    },
    to: {
        type: String,
        default: 0
    },
    total_minutes: {
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
    total_minutes: {
        type: String,
        default: 0
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
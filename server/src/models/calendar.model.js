const mongoose = require('mongoose');

const giornoSchema = new mongoose.Schema({
    giorno: Number,
    ore: Number
})

const meseSchema = new mongoose.Schema({
    mese: Number,
    giorni: [giornoSchema]
})

const annoSchema = new mongoose.Schema({
    anno: Number,
    mesi: [meseSchema]
})

const calendarSchema = new mongoose.Schema({
    anni: [annoSchema]
})

const calendarModel = mongoose.model('Calendar', calendarSchema);
module.exports = calendarModel;

/*
{
    anno: yyyy,
    mesi: [
        {
            mese: mm,
            giorni: [
                {
                    giorno: dd,
                    ore: x
                },
                {
                    giorno: dd,
                    ore: y
                },
                {
                    giorno: dd,
                    ore: z
                }
            ]
        },
        {
            mese: mm,
            giorni: [
                {
                    giorno: dd,
                    ore: x
                },
                {
                    giorno: dd,
                    ore: y
                },
                {
                    giorno: dd,
                    ore: z
                }
            ]
        }
    ]
}
*/
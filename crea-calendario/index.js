const mongoose = require('mongoose');
const generateCalendar = require('./calendarGenerator');
const { connString } = require('./config');
const Year = require('./calendar.model');

const year = process.argv[2];
const startingDay = process.argv[3]
const actualYear = generateCalendar(year, startingDay);

mongoose.connect(connString, (err) => {
    if(!err) console.log('Connesso al DB');
    else console.error('Connessione fallita. ', err);
})

const newYear = new Year(actualYear);
newYear.save().then(() => console.log('Salvato'));

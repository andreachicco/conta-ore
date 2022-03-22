const mongoose = require('mongoose');

const STATES = require('./states');
const Year = require('./models/anno.model');
const Shift = require('./models/shift.model');

const dev = false;

if(dev) require('dotenv').config();

class DataBase {

    //Credenziali DataBase
    dbCredentials = {
        username: process.env.DBUSERNAME,
        password: process.env.DBPASSWORD,
        dbName: process.env.DBNAME
    }

    constructor () {

        //Singleton Pattern
        if(!DataBase.instance) {

            const mongoAtlasUri = `mongodb+srv://${this.dbCredentials.username}:${this.dbCredentials.password}@cluster0.urdgj.mongodb.net/${this.dbCredentials.dbName}?retryWrites=true&w=majority`;
            mongoose.connect(mongoAtlasUri, (err) => {
                if(!err) console.log('Connessione DB riuscita');
                else console.error('Errore connessione DB: ', err);
            });

            DataBase.instance = this;
        }

    }

    async getAllYears() {
        const allYears = await Year.find({});
        return allYears;
    }

    async getYear(yearId) {
        const requestedYear = await Year.findOne({ _id: yearId });
        return requestedYear;
    }

    async getAllMonthsByYearId(yearId) {
        const requestedYear = await this.getYear(yearId);

        const months = requestedYear.months;

        return months;
    }

    async getMonthByYear(yearId, monthId) {
        const months = await this.getAllMonthsByYearId(yearId);
        
        const requestedMonth = months.find(month => month._id == monthId);
        
        return requestedMonth;
    }

    async getShifts() {
        const shifts = await Shift.find({});

        if(shifts) return shifts;
        else return STATES.NOT_FOUND
    }

    //Inserimento turtno lavorativo
    async insertShift(shift) {

        const shiftAlreadyExists = await Shift.findOne({ number: shift.number, type: shift.type });

        if(shiftAlreadyExists) {
            console.log('Già esistente');
            return STATES.ALREADY_EXISTS;
        }

        const newShift = new Shift(shift);
        const inserted = await newShift.save();
        console.log(inserted);
        return STATES.SUCCESS;
    }
}

const dataBase = new DataBase();
Object.freeze(dataBase);

module.exports = dataBase;
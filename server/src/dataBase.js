const mongoose = require('mongoose');

const Year = require('./models/anno.model');
const Shift = require('./models/shift.model');
const User = require('./models/user.model');

const Authentication = require('./auth');

const STATUS_CODES = require('./statusCodes');

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

    async insertUser(user) {
        const newUser = new User(user);
        await newUser.save();

        return STATUS_CODES.OK;
    }

    async getUser(username) {
        return User.findOne({ username: username });
    }

    async verifyUser(user) {

        const selectedUser = await this.getUser(user.username);

        if(selectedUser) {
            try {
                const compared = await Authentication.checkPassword(user.password, selectedUser.password);
    
                if(compared) return user;
                else return STATUS_CODES.UNAUTHORIZED;
            } catch (error) {
                return STATUS_CODES.BAD_REQUEST;
            }
        }
        else return STATUS_CODES.NOT_FOUND;
    }

    //Metodi per ricavare/inserire Anni
    async getAllYears() {

        try {

            const allYears = await Year.find({});
            return {
                code: STATUS_CODES.OK,
                years: allYears
            };

        } catch (error) {
            console.error(error);
            return STATUS_CODES.BAD_REQUEST;
        }
    }

    async getYearById(yearId) {
        
        try {
            const requestedYear = await Year.findById(yearId);
            // requestedYear = await Year.findOne({ _id: yearId });

            if(requestedYear) return {
                code: STATUS_CODES.OK,
                year: requestedYear
            }
            
        } catch (error) {
            console.error(error);
            return STATUS_CODES.NOT_FOUND;
            //return STATUS_CODES.BAD_REQUEST;
        }
    }

    async updateDay(yearId, monthId, dayId, newShift) {

        try {
            const selectedYear = await this.getYearById(yearId);
    
            const selectedMonth = selectedYear.year.months.find(month => month._id == monthId);
            const selectedDay = selectedMonth.days.find(day => day._id == dayId);
            selectedDay.extraordinary = newShift;

            let totalMinutes = 0;
            selectedMonth.days.forEach(day => totalMinutes += day.extraordinary.total_minutes);

            selectedMonth.total_minutes = totalMinutes;
            
            await selectedYear.year.save();

            return {
                code: STATUS_CODES.OK,
                month: selectedMonth
            };
        } catch (error) {
            return STATUS_CODES.BAD_REQUEST;
        }
    }

    /*async getAllMonthsByYearId(yearId) {
        const requestedYear = await this.getYear(yearId);

        const months = requestedYear.months;

        return months;
    }

    async getMonthByYear(yearId, monthId) {
        const months = await this.getAllMonthsByYearId(yearId);
        
        const requestedMonth = months.find(month => month._id == monthId);
        
        return requestedMonth;
    } */


    //Metodi per ricavare/inserire Turni Lavorativi
    async getAllShifts() {
        try {

            const shifts = await Shift.find({});
            return {
                code: STATUS_CODES.OK,
                shifts: shifts
            };

        } catch (error) {
            console.error(error);
            return STATUS_CODES.BAD_REQUEST;
        }
    }

    //Inserimento turtno lavorativo
    async insertShift(shift) {
        try {

            //Turno lavorativo già esistente
            const shiftAlreadyExists = await Shift.findOne({ number: shift.number, type: shift.type });
            if(shiftAlreadyExists) return STATUS_CODES.CONFLICT;

            //Aggiunta turno al DB
            const newShift = new Shift(shift);
            await newShift.save();
            console.log('Turno inserito')
            return STATUS_CODES.CREATED;
        } catch (error) {
            console.error(error);
            return STATUS_CODES.BAD_REQUEST;
        }
    }
}

const dataBase = new DataBase();
Object.freeze(dataBase);

module.exports = dataBase;

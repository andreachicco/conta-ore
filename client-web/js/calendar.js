import Request from "./requests.js";

import auth from "./authentication.js"
import apiEndpoint from "./config.js";

class Calendar { 
    constructor() {

        if(!Calendar.instance) Calendar.instance = this;
    }

    //GET/SET Years
    getYears() {
        return this.years;
    }

    setYears(years) {
        this.years = years;
    } 

    //GET ...ById
    getYearById(yearId) {

        const selectedYear = this.years.find(year => year._id == yearId);
        if(selectedYear) return selectedYear;
        else throw new Error("Anno non trovato");
    }

    getMonthById(yearId, monthId) {
        const year = this.getYearById(yearId);
        const selectedMonth = year.months.find(month => month._id == monthId);

        if(selectedMonth) return selectedMonth;
        else throw new Error("Mese non trovato")
    }

    getDayById(yearId, monthId, dayId) {
        const month = this.getMonthById(yearId, monthId);
        const selectedDay = month.days.find(day => day._id == dayId);

        if(selectedDay) return selectedDay;
        else throw new Error("Giorno non trovato");
    }

    //GET/SET selected...Id
    getSelectedYearId() {
        return this.selectedYearId;
    }

    setSelectedYearById(yearId) {
        this.selectedYearId = yearId;
    }

    getSelectedMonthId() {
        return this.selectedMonthId;
    }
    
    setSelectedMonthId(monthId) {
        this.selectedMonthId = monthId;
    }

    setSelectedDayId(dayId) {
        this.selectedDayId = dayId;
    }

    getSelectedDayId() {
        return this.selectedDayId;
    }

    setDayShift(yearId, monthId, dayId, newShift) {
        const selectedDay = this.getDayById(yearId, monthId, dayId);
        selectedDay.extraordinary = newShift;
    }

    //Fetch Anni
    async fetchYears() {
        const yearsResponse = await Request.fetchData(`${apiEndpoint}/years`, {
            method: 'GET',
            headers: {
                authorization: await auth.getJwtToken()
            }
        });
    
        const years = await yearsResponse.json();

        if(years) return years;
        else throw new Error('Errore nel fetch degli anni');
    }
}

const calendar = new Calendar();
//Object.freeze(calendar);

export default calendar;
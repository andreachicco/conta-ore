const { months, days } = require('./config');

const generateCalendar = (year, startingDay) => {
    const actualYear = {
        year: year,
        months: []
    }
    
    let dayIndex = startingDay;
    
    months.forEach((month, index) => {
        const newDate = new Date(year, index + 1, 0);
    
        //console.log(newDate.getMonth())
    
        const actualMonth = {
            index: index + 1,
            name: month,
            days: []
        };
    
        actualYear.months.push(actualMonth);
    
        const dayInMonth = newDate.getDate();
        
        for(let i = 1; i <= dayInMonth; i++) {
    
            
            if(dayIndex === 7) {
                dayIndex = 0;
            }
            //console.log(days[dayIndex], dayIndex);
    
            const actualDay = {
                index: i,
                name: days[dayIndex],
                extraordinary: {
                    
                }
            }
    
    
            dayIndex++;
    
            actualYear.months[index].days.push(actualDay);
    
        }
    });

    return actualYear;
}

module.exports = generateCalendar;
import Request from "./requests.js";

import auth from "./authentication.js"
import apiEndpoint, { NULL_SHIFT, MID_SHIFT } from "./config.js";
import calendar from "./calendar.js";
let shifts = [];


const loading = document.querySelector('.loading');

const goUpBtn = document.querySelector('.go-up');
goUpBtn.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

function setYearsInDropDownMenu() {
    
    const dropDownMenu = document.querySelector('.dropdown-menu');
    const years = calendar.getYears();

    if(years.length !== 0) {
        years.forEach((year) => {
            dropDownMenu.innerHTML += `<li><a data-year-id="${year._id}" class="dropdown-item" href="#">${year.year}</a></li>`
        });
    }
    else console.info('Nessun anno presente');


    listenForYearSelection();
}

function listenForYearSelection() {
    const dropDownMenuItems = document.querySelectorAll('.dropdown-item');

    dropDownMenuItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();

            const targetYear = event.target;
            const targetYearId = targetYear.dataset.yearId;

            //Mostra il button per tornare in cima
            goUpBtn.classList.remove('hide');

            const dropdownBtn = document.querySelector('.dropdown-toggle');
            dropdownBtn.value = targetYearId;

            //Imposta l'anno selezionato come testo per il button
            dropdownBtn.innerText = targetYear.innerText;

            try {
                const selectedYear = calendar.getYearById(targetYearId);
                calendar.setSelectedYearById(targetYearId);

                renderYear(selectedYear);
            } catch (error) {
                console.error('Errore: ', error);
            }
        });
    });
}

function renderYear(yearToRender) {

    const { months } = yearToRender;

    const monthsList = document.querySelector('.months-list');
    monthsList.innerHTML = '';
    
    //Rendering dei mesi
    months.forEach(month => renderMonth(month));
}

function renderMonth(monthToRender) {
    const { name: monthName, _id: monthId, index, total_minutes } = monthToRender;
        
    const nestedList = document.querySelector('.nested-list');
    nestedList.innerHTML += `
        <li data-month-id="${monthId}" class="month mt-1">
            <div class="month-info d-flex flex-column align-items-center justify-content-center ${index}">
                <h5 class="month-name">${capitalizeFirstLetter(monthName)}</h5>
                <p class="total-hour ${monthName}">Ore totali: ${getHourFromMinutes(total_minutes)}</p>
            </div>
            <ul class="list-group inner days-list" id="${monthName}">

            </ul>
        </li>
    `;

    listenForMonthSelection();
}

function listenForMonthSelection() {
    const monthList = document.querySelectorAll('.month .month-info');

    monthList.forEach(month => {
        month.addEventListener('click', event => {
            event.preventDefault();

            //Cambia colore se selezionato
            month.classList.toggle('selected');

            const selectedMonthId = month.parentElement.dataset.monthId;
            const selectedMonth = calendar.getMonthById(calendar.getSelectedYearId(), selectedMonthId);

            if(month.classList.contains('selected')) {
                calendar.setSelectedMonthId(selectedMonthId);
                
                try {
                    const { days } = selectedMonth;

                    days.forEach(day => renderDay(day));

                    //Auto Scroll se sul mese attuale
                    checkIfCurrentMonth(month);

                } catch (error) {
                    console.log(error);
                } 
            }
            else {
                const daysList = document.querySelector(`#${selectedMonth.name}`);
                daysList.innerHTML = '';
            }
        });
    });
}

function checkIfCurrentMonth(month) {
    const date = new Date();
    const todayMonth = date.getMonth() + 1;

    const monthSelector = getTodayDateSelector();

    if(month.classList.contains(todayMonth)) scrollToElement(monthSelector);
}

function renderDay(dayToRender) {
    const { name: dayName, _id: dayId, extraordinary, index} = dayToRender;
    const { _id: extraordinaryId, total_miutes: shiftTotalMinutes, number: shiftNumber } = extraordinary;
    
    const year = calendar.getYearById(calendar.getSelectedYearId());
    const { year: yearNumber } = year; 
    
    const month = calendar.getMonthById(calendar.getSelectedYearId(), calendar.getSelectedMonthId());
    const { name: monthName } = month;
    
    const dayNumber = index < 10 ? "0" + index.toString() : index.toString();
    
    const daysList = document.querySelector(`#${monthName}`);

    const shiftOptions = (shiftTotalMinutes !== 0) ? renderShiftOptions(false, shiftNumber) : renderShiftOptions(true);
    
    daysList.innerHTML += `
        <li data-day-id="${dayId}" class="day ${monthName}-${index}-${yearNumber}">
            <div class="day-container">
                <div class="day-info">
                    <h6 class="day-name">${capitalizeFirstLetter(dayName)}</h6>
                    <h6 class="day-index">${dayNumber}</h6>
                </div>
                <div class="hour-info ${extraordinaryId}">
                    <select class="form-select form-control mb-1 shift-selector" id="shift-type" aria-label="Default select example">
                        ${shiftOptions}
                    </select>
                    <p class="from">Da: ${extraordinary.from}</p>
                    <p class="to">A: ${extraordinary.to}</p>
                </div>
            </div>
        </li>
    `;

    listenForShiftSelection();
}

function listenForShiftSelection() {
    const shiftList = document.querySelectorAll('.shift-selector');

    shiftList.forEach(shiftItem => {
        shiftItem.addEventListener('change', async(event) => {
            event.preventDefault();

            const selectedShift = event.target;
            const selectedShiftId = selectedShift.value;

            //Aggiorno l'id del mese selezionato
            const monthId = selectedShift.closest("[data-month-id]").dataset.monthId;
            calendar.setSelectedMonthId(monthId);

            const dayId = selectedShift.closest("[data-day-id]").dataset.dayId;
            calendar.setSelectedDayId(dayId);

            const from = selectedShift.parentElement.querySelector('.from');
            const to = selectedShift.parentElement.querySelector('.to');

            let newShift = {};

            if(selectedShiftId == 'null') {
                from.innerText = 'Da: 0';
                to.innerText = 'A: 0';

                newShift = {
                    number: NULL_SHIFT,
                    from: 0,
                    to: 0,
                    total_minutes: 0
                };
            }
            else if(selectedShiftId == 'mid-shift') {
                const insertedFrom = prompt('Inserisci Da:');
                const insertedTo = prompt('Inserisci A:');

                from.innerText = `Da: ${insertedFrom}`;
                to.innerText = `A: ${insertedTo}`;

                const fromMinutes = (insertedFrom.split(':')[0] / 60) + insertedFrom.split(':')[1];   
                const toMinutes = (insertedTo.split(':')[0] / 60) + insertedTo.split(':')[1];   

                newShift = {
                    number: MID_SHIFT,
                    from: insertedFrom,
                    to: insertedTo,
                    total_minutes: fromMinutes > toMinutes ? ((24 * 60) - toMinutes - fromMinutes) : toMinutes - fromMinutes
                }
            }
            else {
                const searchedShift = shifts.find(shift => shift._id == selectedShiftId);
                const { number: shiftNumber, from: shiftFrom, to: shiftTo, total_minutes: shiftTotalMinutes } = searchedShift;

                from.innerText = `Da: ${shiftFrom}`;
                to.innerText = `A: ${shiftTo}`;

                newShift = {
                    number: shiftNumber,
                    from: shiftFrom, 
                    to: shiftTo,
                    total_minutes: shiftTotalMinutes
                }
            }

            calendar.setDayShift(
                calendar.getSelectedYearId(),
                calendar.getSelectedMonthId(),
                calendar.getSelectedDayId(), 
                newShift
            );

            loading.classList.remove('display-none');
            document.body.style.overflow = "hidden";
            const response = await Request.fetchData(`${apiEndpoint}/years/${calendar.getSelectedYearId()}/months/${calendar.getSelectedMonthId()}/days/${calendar.getSelectedDayId()}`, {
                method: 'PATCH',
                headers: {
                    authorization: await auth.getJwtToken(),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newShift),
            });

            if(response) {
                const jsonResponse = await response.json();
                const responseMonth = jsonResponse.month;
                const monthHoursElement = document.querySelector(`.${responseMonth.name}`);
                monthHoursElement.innerText = `Ore totali: ${getHourFromMinutes(responseMonth.total_minutes)}`;
            }
            loading.classList.add('display-none');
            document.body.style.overflow = "auto";
        })
    });
}

function renderShiftOptions(isEmpty, shiftNumber = null) {

    let html = ``;
    html = isEmpty ? `<option value="null" selected>Seleziona</option>` : `<option value="null">Seleziona</option>`;
    html += shiftNumber === -1 ? '<option selected value="mid-shift">Mezzo Turno</option>' : '<option value="mid-shift">Mezzo Turno</option>'

    shifts.map(shift => {
        if(!isEmpty && shift.number === shiftNumber) html += `<option selected value="${shift._id}">${shift.number} ${capitalizeFirstLetter(shift.type)}</option>`;
        else html += `<option value="${shift._id}">${shift.number} ${capitalizeFirstLetter(shift.type)}</option>`;
    });

    return html;
}

function scrollToElement(element) {
    try {
        document.querySelector(element).scrollIntoView({ block: 'center', behavior: 'smooth' });
    } catch (error) {
        console.log("Non esiste selettore");
    }
}

function getTodayDateSelector() {

    const date = new Date();

    const selectedMonth = calendar.getMonthById(
        calendar.getSelectedYearId(),
        calendar.getSelectedMonthId(),
        calendar.getSelectedDayId()
    );

    const dayIndex = date.getDate();

    const year = date.getFullYear();
    
    const monthSelector = `.${selectedMonth.name}-${dayIndex}-${year}`
    
    return monthSelector;
}

async function init() {
    
    //Fetch degli anni presenti nel database
    const allYears = await calendar.fetchYears();
    calendar.setYears(allYears);

    shifts = await Request.fetchData(`${apiEndpoint}/shifts`, {
        method: 'GET',
        headers: {
            authorization: await auth.getJwtToken()
        }
    }); 

    shifts = await shifts.json(); 

    setYearsInDropDownMenu();

    loading.classList.add('display-none');
}

init();

/* Hlper Functions */
function capitalizeFirstLetter(word) {
    return word[0].toUpperCase() + word.substring(1);
}

function getHourFromMinutes(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    if(h === 0 && m === 0) return '0';
    else return `${h}:${m}`;
}
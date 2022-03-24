import Request from "./requests.js";
import { apiEndpoint, getUserToken } from "./config.js";

let jwtToken = '';
let years = [];
let shifts = [];

let selectedYearId;

const goUpBtn = document.querySelector('.go-up');

goUpBtn.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


function listenForClick() {
    const dropDownMenuItems = document.querySelectorAll('.dropdown-item');

    dropDownMenuItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const targetYear = event.target;

            goUpBtn.classList.remove('hide');

            const targetId = targetYear.dataset.itemId;
            
            const dropdownBtn = document.querySelector('.dropdown-toggle');
            dropdownBtn.value = targetId;
            dropdownBtn.innerText = targetYear.innerText;

            const year = years.filter(x => x._id === targetId);
            selectedYearId = year[0]._id;
            renderYear(year);

        });
    });
}

function setYearsInMenu() {
    
    years.forEach((year) => {
        const dropDownMenu = document.querySelector('.dropdown-menu');
        dropDownMenu.innerHTML += `<li><a data-item-id="${year._id}" class="dropdown-item" href="#">${year.year}</a></li>`
    });

    listenForClick();
}

function capitalizeFirstLetter(word) {
    return word[0].toUpperCase() + word.substring(1);
}

function renderMonth(monthToRender) {
    const { name: monthName, _id: monthId, index, total_minutes } = monthToRender;
        
    const nestedList = document.querySelector('.nested-list');
    nestedList.innerHTML += `
        <li data-month-id="${monthId}" class="month mt-1">
            <div class="month-info d-flex flex-column align-items-center justify-content-center ${index}">
                <h5 class="month-name">${capitalizeFirstLetter(monthName)}</h5>
                <p class="total-hour">Ore totali: ${total_minutes}</p>
            </div>
            <ul class="list-group inner days-list" id="${monthName}">

            </ul>
        </li>
    `;
}

function renderShiftOptions(isEmpty, shiftNumber = null) {

    let html = ``;
    isEmpty ? html = `<option value="nullo" selected>Seleziona</option>` : html = `<option value="nullo">Seleziona</option>`;

    console.log(html);

    shifts.map(shift => {
        if(!isEmpty && shift.number === shiftNumber) html += `<option selected value="${shift._id}">${shift.number} ${capitalizeFirstLetter(shift.type)}</option>`;
        else html += `<option value="${shift._id}">${shift.number} ${capitalizeFirstLetter(shift.type)}</option>`;
    });

    return html;
}

let shiftOptions = ``;

function renderDay(dayToRender, monthName, year) {
    const { name: dayName, _id: dayId, extraordinary } = dayToRender;
    const { _id: extraordinaryId } = extraordinary;
    const { index } = dayToRender;
    
    let newIndex = index < 10 ? "0" + index.toString() : index.toString();
    
    const daysList = document.querySelector(`#${monthName}`);
    if(extraordinary.number) shiftOptions = renderShiftOptions(false, extraordinary.number);
    else shiftOptions = renderShiftOptions(true);
    daysList.innerHTML += `
        <li data-day-id="${dayId}" class="day ${monthName}-${index}-${year}">
            <div class="day-container">
                <div class="day-info">
                    <h6 class="day-name">${capitalizeFirstLetter(dayName)}</h6>
                    <h6 class="day-index">${newIndex}</h6>
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

    const shiftSelectors = document.querySelectorAll('.shift-selector');

    shiftSelectors.forEach(selector => {
        selector.addEventListener('change', async(event) => {
            event.preventDefault();
            const target = event.target;

            const parentElement = target.parentElement;
            const dayListElement = target.parentElement.parentElement.parentElement;
            const monthElement = dayListElement.parentElement.parentElement;
            
            const month = monthElement.dataset.monthId;
            const day = dayListElement.dataset.dayId;

            const from = parentElement.querySelector('.from');
            const to = parentElement.querySelector('.to');

            const targetId = target.value;

            if(targetId == 'nullo') {
                from.innerText = `Da: `;
                to.innerText = `A: `;

                const nullShift = {
                    number: 0,
                    from: 0, 
                    to: 0,
                    total_minutes: 0
                }

                await Request.fetchData(`${apiEndpoint}/years/${selectedYearId}/months/${month}/days/${day}`, {
                    method: 'PATCH',
                    headers: {
                        authorization: jwtToken,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nullShift),
                });

                return;
            }

            const selectedShift = shifts.find(shift => shift._id === targetId);
            
            const { from: shiftFrom, to: shiftTo } = selectedShift;
            
            
            if(selectedShift){
                from.innerText = `Da: ${shiftFrom}`;
                to.innerText = `A: ${shiftTo}`;
            }
            else {
                from.innerText = `Da: `;
                to.innerText = `A: `;
            }
            
            //TODO RICHIESTE AL SERVER PER AGGIORNARE I DATI
            
            await Request.fetchData(`${apiEndpoint}/years/${selectedYearId}/months/${month}/days/${day}`, {
                method: 'PATCH',
                headers: {
                    authorization: jwtToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selectedShift),
            });
        });
    });
}

function renderYear(yearToRender) {
    const { months, year } = yearToRender[0];

    const nestedList = document.querySelector('.nested-list');
    nestedList.innerHTML = '';
    
    months.forEach(month => {
        
        renderMonth(month);

    });

    const monthInfosList = document.querySelectorAll('.month .month-info');
    
    monthInfosList.forEach(month => {
        month.addEventListener('click', (event) => {
            event.preventDefault();
            month.classList.toggle('selected');
            //console.log(month.dataset);
            const { monthId } = month.parentElement.dataset;
            
            const monthToRender = months.filter(elem => elem._id === monthId);
            
            const { days, name: monthName } = monthToRender[0];
            if(month.classList.contains('selected')) {

                days.forEach(day => {
                    renderDay(day, monthName, year);
                });

                const monthSelector = getTodayDateSelector(months);

                const date = new Date();
                const todayMonth = date.getMonth() + 1;

                if(month.classList.contains(todayMonth)) scrollToElement(monthSelector);
                
            }
            else {
                const daysList = document.querySelector(`#${monthName}`);
                daysList.innerHTML = '';
            }
        });
    });
}

function scrollToElement(element) {
    try {
        document.querySelector(element).scrollIntoView({ block: 'center', behavior: 'smooth' });
    } catch (error) {
        console.log("Non esiste selettore");
    }
}

function getTodayDateSelector(months) {
    const date = new Date();

    const monthIndex = date.getMonth() + 1;

    const todayMonth = months.filter(month => month.index === monthIndex);
    const dayIndex = date.getDate();

    const year = date.getFullYear();
    
    const monthSelector = `.${todayMonth[0].name}-${dayIndex}-${year}`
    
    return monthSelector;
}

async function init() {

    const user = getUserCredentials();
    
    jwtToken = await getUserToken(user);

    years = await Request.fetchData(`${apiEndpoint}/years`, {
        method: 'GET',
        headers: {
            authorization: jwtToken
        }
    });

    shifts = await Request.fetchData(`${apiEndpoint}/shifts`, {
        method: 'GET',
        headers: {
            authorization: jwtToken
        }
    });

    setYearsInMenu();
}

init();

function getUserCredentials() {
    const username = prompt('Enter your username');
    const password = prompt('Enter your password');
    
    const user = {
        username: username,
        password: password
    };

    return user;
}
import Request from "./requests.js";
const apiUrl = 'http://localhost:3000/api/v1';

const insertForm = document.querySelector('.insert-form');

insertForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const shiftNumber = document.querySelector('#shift-number').value;
    const shiftType = document.querySelector('#shift-type').value;
    const shiftFrom = document.querySelector('#shift-from').value;
    const shiftTo = document.querySelector('#shift-to').value;

    if(!shiftNumber || !shiftType || !shiftFrom || !shiftTo) alert("Inserire tutti i campi");
    else {
        const newShift = {
            shiftNumber: shiftNumber,
            shiftType: shiftType,
            from: shiftFrom,
            to: shiftTo
        }

        const response = await Request.fetchData(`${apiUrl}/shifts`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newShift),
        });

        insertForm.reset();
        const insertResult = document.querySelector('.insert-result');

        insertResult.innerText = '';

        if(response.status === 201) insertResult.innerText = 'Inserimento Riuscito';
        else insertResult.innerText = 'Inserimento NON Riuscito';

        setTimeout(() => { insertResult.innerText = '' }, 2000);

    }
});
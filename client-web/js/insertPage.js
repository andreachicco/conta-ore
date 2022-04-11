import Request from "./requests.js";
import apiEndpoint from "./config.js";

import auth from "./authentication.js";

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

        const response = await Request.fetchData(`${apiEndpoint}/shifts`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': await auth.getJwtToken()
            },
            body: JSON.stringify(newShift),
        });

        console.log(response.status);

        insertForm.reset();
        const insertResult = document.querySelector('.insert-result');

        insertResult.innerText = '';

        switch(response.status) {
            case 201: 
                insertResult.innerText = 'Inserimento Riuscito';
                break;
            case 401: 
                insertResult.innerText = 'Non si dispone delle autorizzazioni necessrie'
                break;
            default: 
                insertResult.innerText = 'Inserimento NON riuscito';
                break;
        }

        setTimeout(() => { insertResult.innerText = '' }, 2000);

    }
});
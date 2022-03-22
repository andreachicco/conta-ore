const express = require('express');

const STATES = require('../states');
const dataBase = require('../dataBase');
const shiftsRouter = express.Router();

shiftsRouter.get('/shifts', async (req, res) => {
    const shifts = await dataBase.getShifts();
    
        if(shifts === STATES.NOT_FOUND) res.status(404).json({ message: 'Nessun turno trovato' });
        else res.status(200).json(shifts);

});

shiftsRouter.post('/shifts', async (req, res) => {
    const { shiftNumber, shiftType, from, to } = req.body;

    const newShift = {
        number: shiftNumber,
        type: shiftType,
        from: from,
        to: to
    };

    const inserted = await dataBase.insertShift(newShift);

    switch(inserted) {
        case STATES.SUCCESS:
            res.status(200).json({ message: 'Elemento inserito' });
            break;
        case STATES.ALREADY_EXISTS:
            res.status(409).jsonp({ message: 'Elemento già inserito' });
    }
});

module.exports = shiftsRouter;
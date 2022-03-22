const express = require('express');

const STATES = require('../states');
const dataBase = require('../dataBase');
const shiftsRouter = express.Router();

shiftsRouter.get('/shifts', async (req, res) => {

    res.json({
        message: 'Turni lavorativi'
    })
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

    if(inserted === STATES.SUCCESS) res.status(200).json({ message: 'Elemento inserito' });
    else res.status(409).send("Errore");
});

module.exports = shiftsRouter;
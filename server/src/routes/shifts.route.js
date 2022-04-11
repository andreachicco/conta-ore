const express = require('express');

const STATUS_CODES = require('../statusCodes');
const dataBase = require('../dataBase');
const shiftsRouter = express.Router();

<<<<<<< HEAD
shiftsRouter.get('/shifts', async (req, res) => {
=======
const { authenticateToken, checkIfAdmin } = require('../middlewares/auth.midlleware');

shiftsRouter.get('/shifts', authenticateToken, async (_req, res) => {
>>>>>>> development
    
    const selected = await dataBase.getAllShifts();
    const { code, shifts } = selected

    if(code === STATUS_CODES.OK) res.status(STATUS_CODES.OK).json(shifts);
    else res.sendStatus(STATUS_CODES.BAD_REQUEST);

});

<<<<<<< HEAD
shiftsRouter.get('/shifts/:shift', async (req, res) => {
    const { shift } = req.params;

    
});

shiftsRouter.post('/shifts', async (req, res) => {
=======
shiftsRouter.post('/shifts', checkIfAdmin, async (req, res) => {
>>>>>>> development
    const { shiftNumber, shiftType, from, to } = req.body;

    const newShift = {
        number: shiftNumber,
        type: shiftType,
        from: from,
        to: to
    };

    const insertionCode = await dataBase.insertShift(newShift);

    switch(insertionCode) {
        case STATUS_CODES.OK: 
            res.sendStatus(STATUS_CODES.OK);
            break;
        case STATUS_CODES.BAD_REQUEST:
            res.sendStatus(STATUS_CODES.BAD_REQUEST);
            break;
        case STATUS_CODES.CONFLICT: 
            res.sendStatus(STATUS_CODES.CONFLICT);
            break;
    }
});

module.exports = shiftsRouter;
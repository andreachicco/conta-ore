const express = require('express');

const STATUS_CODES = require('../statusCodes');
const { dbCalendar } = require('../dataBase');
const shiftsRouter = express.Router();

const { authenticateToken, checkIfAdmin } = require('../middlewares/auth.midlleware');

shiftsRouter.get('/shifts', authenticateToken, async (_req, res) => {
    
    const selected = await dbCalendar.getAllShifts();
    const { code, shifts } = selected

    if(code === STATUS_CODES.OK) res.status(STATUS_CODES.OK).json(shifts);
    else res.sendStatus(STATUS_CODES.BAD_REQUEST);

});

shiftsRouter.post('/shifts', checkIfAdmin, async (req, res) => {
    const { shiftNumber, shiftType, from, to } = req.body;

    const newShift = {
        number: shiftNumber,
        type: shiftType,
        from: from,
        to: to
    };

    const insertionCode = await dbCalendar.insertShift(newShift);

    switch(insertionCode) {
        case STATUS_CODES.OK: 
            res.sendStatus(STATUS_CODES.OK);
            break;
        case STATUS_CODES.CREATED:
            res.sendStatus(STATUS_CODES.CREATED);
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
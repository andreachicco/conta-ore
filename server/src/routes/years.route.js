const express = require('express');
const dataBase = require('../dataBase');
const STATUS_CODES = require('../statusCodes');
const authenticationMiddleware = require('../middlewares/auth.midlleware');
const { getMinutesFromHours } = require('../helper');

const defaultRouter = express.Router();

defaultRouter.get(`/years`, authenticationMiddleware.authenticateToken, async (_req, res) => {

  const selected = await dataBase.getAllYears();
  const { code, years } = selected;

  if(code === STATUS_CODES.OK) res.status(STATUS_CODES.OK).json(years);
  else res.sendStatus(STATUS_CODES.BAD_REQUEST);
});

defaultRouter.get(`/years/:yearId`, authenticationMiddleware.authenticateToken, async (req, res) => {
  const { yearId } = req.params;

  const requestedYear = await dataBase.getYearById(yearId);

  switch(requestedYear) {
    case STATUS_CODES.BAD_REQUEST: 
      res.sendStatus(STATUS_CODES.BAD_REQUEST);
      break;
    case STATUS_CODES.NOT_FOUND:
      res.sendStatus(STATUS_CODES.NOT_FOUND);
      break;
    default: 
      const year = requestedYear.year; 
      res.status(STATUS_CODES.OK).json(year);
      break;
  }

});

defaultRouter.patch('/years/:yearId/months/:monthId/days/:dayId', async (req, res) => {
  const { yearId, monthId, dayId } = req.params;

  const { number, type, from, to } = req.body;

  const newShift = {
    number: number,
    type: type,
    from: from,
    to: to
  }

  let response;

  try {
    const fromTotalMinutes = getMinutesFromHours(from);
    const toTotalMinutes = getMinutesFromHours(to);
    let totalMinutes = 0;
  
    if(fromTotalMinutes > toTotalMinutes) {
      const dayTotalMinutes = 24 * 60;
  
      totalMinutes = dayTotalMinutes - (fromTotalMinutes - toTotalMinutes);
  
    }
    else totalMinutes = toTotalMinutes - fromTotalMinutes;
    response = await dataBase.updateDay(yearId, monthId, dayId, {...newShift, total_minutes: totalMinutes});

  } catch (error) {
    response = await dataBase.updateDay(yearId, monthId, dayId, {...newShift, total_minutes: 0});
  }

  if(response.code === STATUS_CODES.OK) res.status(STATUS_CODES.OK).json({ month: response.month });
  else res.sendStatus(response);
});

module.exports = defaultRouter;
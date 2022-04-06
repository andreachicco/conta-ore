const express = require('express');
const dataBase = require('../dataBase');
const STATUS_CODES = require('../statusCodes');
const authenticationMiddleware = require('../middlewares/auth.midlleware');

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
    const fromHour = parseInt(from.split(':')[0]);
    const fromMinutes = parseInt(from.split(':')[1])
    const fromTotalMinutes = (fromHour * 60) + fromMinutes;
  
    const toHour = parseInt(to.split(':')[0]);
    const toMinutes = parseInt(to.split(':')[1])
    const toTotalMinutes = (toHour * 60) + toMinutes;
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

/*defaultRouter.get(`/years/:year/months/`, authenticationMiddleware.authenticateToken, async (req, res) => {
  const { year } = req.params;

  const allMonths = await dataBase.getAllMonthsByYear(year);

  if(allMonths) res.status(200).json(allMonths);
  else res.sendStatus(404);
});

defaultRouter.get(`/years/:year/months/:month`, authenticationMiddleware.authenticateToken, async (req, res) => {
  const { year, month } = req.params;

  const requestedMonth = await dataBase.getMonthByYear(year, month);

  if(requestedMonth) res.status(200).json(requestedMonth);
  else res.sendStatus(404);
});*/

module.exports = defaultRouter;
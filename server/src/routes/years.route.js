const express = require('express');
const dataBase = require('../dataBase');
const STATUS_CODES = require('../statusCodes');
const authenticationMiddleware = require('../middlewares/auth.midlleware');

const defaultRouter = express.Router();

defaultRouter.get(`/years`, authenticationMiddleware.authenticateToken, async (req, res) => {

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
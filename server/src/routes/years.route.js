const express = require('express');
const dataBase = require('../dataBase');
const authenticationMiddleware = require('../middlewares/auth.midlleware');

const defaultRouter = express.Router();

defaultRouter.get('/', (req, res) => {
  res.redirect('/api/v1/auth');
});

defaultRouter.get(`/years`, authenticationMiddleware.authenticateToken, async (req, res) => {

  const allYears = await dataBase.getAllYears();

  if(allYears) res.status(200).json(allYears);
  else res.sendStatus(404);
});

defaultRouter.get(`/years/:year`, authenticationMiddleware.authenticateToken, async (req, res) => {
  const { year } = req.params;

  const requestedYear = await dataBase.getYear(year);

  if(requestedYear) res.status(200).json(requestedYear);
  else res.sendStatus(404);
});

defaultRouter.get(`/years/:year/months/`, authenticationMiddleware.authenticateToken, async (req, res) => {
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
});

module.exports = defaultRouter;
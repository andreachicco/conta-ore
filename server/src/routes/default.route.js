const express = require('express');
const defaultRouter = express.Router();

const calendarModel = require('../models/calendar.model');

const startingEndpoint = '/api/';

defaultRouter.get(`${startingEndpoint}anno/:anno/mese/:mese/giorno/:giorno/`, (req, res) => {
  const { anno, mese, giorno } = req.params;

  res.send(`Anno selezionato: ${anno}, mese: ${mese}, giorno: ${giorno}`);
})

module.exports = defaultRouter;
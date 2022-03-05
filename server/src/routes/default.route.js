const express = require('express');
const authenticationMiddleware = require('../middlewares/auth.midlleware');
const Year = require('../models/anno.model');
const defaultRouter = express.Router();

defaultRouter.get(`/years`, authenticationMiddleware.authenticateToken, async (req, res) => {

  /*const limit = req.query.limit || 0;
  const offset = req.query.offset || 0;*/

  const allYears = await Year.find({});
  //console.log(allYears);

  res.status(200).json(allYears);
})

defaultRouter.get(`/years/:year`, (req, res) => {
  const { year } = req.params;

  res.send(`Anno selezionato: ${year}`);
})

module.exports = defaultRouter;
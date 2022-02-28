const express = require('express')
const mongoose = require('mongoose');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 3000

//Connessione DB
const dbCredentials = {
  username: process.env.DBUSERNAME,
  password: process.env.DBPASSWORD,
  dbName: process.env.DBNAME
}

const mongoAtlasUri = `mongodb+srv://${dbCredentials.username}:${dbCredentials.password}@cluster0.urdgj.mongodb.net/${dbCredentials.dbName}?retryWrites=true&w=majority`;
mongoose.connect(mongoAtlasUri, (err) => {
  if(!err) console.log('Connessione DB riuscita')
});

const startingEndpoint = '/api/';

app.get(`${startingEndpoint}:anno/:mese/:giorno/`, (req, res) => {
  const { anno, mese, giorno } = req.params;

  res.send(`Anno selezionato: ${anno}, mese: ${mese}, giorno: ${giorno}`);
})

/*app.get(`${startingEndpoint}:anno/:mese`, (req, res) => {
  const { anno, mese } = req.params;
  res.send(`Anno selezionato: ${anno}, mese: ${mese}`);
})

app.get(`${startingEndpoint}:anno`, (req, res) => {
  const { anno } = req.params;
  res.send(`Anno selezionato: ${anno}`);
})*/

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
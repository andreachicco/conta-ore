const express = require('express')
const mongoose = require('mongoose');

const dev = false;

if(dev) require('dotenv').config();

const app = express()
const port = process.env.PORT || 3000
const defaultRouter = require('./routes/default.route');

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

app.use('/', defaultRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
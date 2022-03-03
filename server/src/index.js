const express = require('express')
const dataBase = require('./dataBase');

const app = express()
const port = process.env.PORT || 3000
const defaultRouter = require('./routes/default.route');

app.use('/', defaultRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
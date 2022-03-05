const express = require('express')
const dataBase = require('./dataBase');

const app = express()
const port = process.env.PORT || 3000

const authRouter = require('./routes/auth.route');
const defaultRouter = require('./routes/default.route');

app.use('/api/v1/auth', authRouter);
app.use('/api/v1', defaultRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
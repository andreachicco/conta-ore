const express = require('express')
const helmet = require('helmet');
const cors = require('cors');
const dataBase = require('./dataBase');

const app = express()

app.use(express.json());
app.use(helmet());
app.use(cors());

const port = process.env.PORT || 3000

const authRouter = require('./routes/auth.route');
const yearsRouter = require('./routes/years.route');
const shiftsRouter = require('./routes/shifts.route');

app.use('/api/v1/auth', authRouter);
app.use('/api/v1', yearsRouter);
app.use('/api/v1', shiftsRouter);

app.get('/', (req, res) => {
  res.redirect('/api/v1/auth');
})

app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`)
})
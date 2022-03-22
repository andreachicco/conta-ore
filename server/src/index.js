const express = require('express')
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const dataBase = require('./dataBase');

const app = express()

//Middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));

//Routes
const authRouter = require('./routes/auth.route');
const yearsRouter = require('./routes/years.route');
const shiftsRouter = require('./routes/shifts.route');

app.use('/api/v1/auth', authRouter);
app.use('/api/v1', yearsRouter);
app.use('/api/v1', shiftsRouter);

//Default route -> Riporta alla route di autenticazione
app.get('/', (req, res) => {
  res.redirect('/api/v1/auth');
})

//Ascolto del server sulla porta scelta
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`)
})
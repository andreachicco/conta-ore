const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/api/:anno', (req, res) => {
  const { anno } = req.params;
  res.send(`Anno selezionato: ${anno}`);
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
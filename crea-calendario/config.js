require('dotenv').config();

const DB_CREDENTIALS = {
    username: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    name: process.env.DBNAME,
}

const months = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dec'];
const days = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'];

const connString = `mongodb+srv://${DB_CREDENTIALS.username}:${DB_CREDENTIALS.password}@cluster0.urdgj.mongodb.net/${DB_CREDENTIALS.name}?retryWrites=true&w=majority`

module.exports = {
    months,
    days,
    connString
}
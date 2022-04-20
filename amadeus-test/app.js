require('dotenv').config();
const app = require('express')();

const port = process.env.PORT;
const hostname = process.env.HOSTNAME;

app.use('/amadeus', require('./routes/amadeusRoutes.js').router);

app.listen(port, hostname, () => {
    console.log(`Server is listening on ${hostname}:${port}`);
});
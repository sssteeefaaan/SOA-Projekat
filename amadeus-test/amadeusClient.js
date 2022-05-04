require('dotenv').config();
const Amadeus = require('amadeus');

const clientId = process.env.AMADEUS_API_KEY;
const clientSecret = process.env.AMADEUS_API_SECRET;
const grantType = "client_credentials";

const client = new Amadeus({
    clientId,
    clientSecret
});

module.exports = {
    client
};
const router = require('express').Router();
const { client } = require('../amadeusClient.js');

router.get('/hotels', async(req, res) => {
    try {
        client.shopping.hotelOffers.get({
            cityCode: 'PAR'
        }).then(response => {
            res.send(response.data);
        }).catch(err => {
            console.log(err);
            res.status(500).send(err.code);
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/flights', async(req, res) => {
    try {
        client.shopping.flightOffersSearch.get({
            originLocationCode: 'SYD',
            destinationLocationCode: 'BKK',
            departureDate: '2022-06-01',
            adults: '2'
        }).then(function(response) {
            res.send(response.data);
        }).catch(function(responseError) {
            res.status(501).send(responseError.code);
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = { router };
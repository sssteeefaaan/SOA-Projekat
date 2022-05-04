const router = require('express').Router();
const { client } = require('../amadeusClient.js');

router.post('/availabilities', async(req, res) => {

});

router.get('/dates', async(req, res) => {

});

router.get('/destinations', async(req, res) => {

});

router.get('/offers/search', async(req, res) => {
    try {
        if (!(req.query.originLocationCode && req.query.destinationLocationCode && req.query.departureDate && req.query.adults))
            res.status(401).send({ data: {}, message: "Invalid parameters!" });

        client.shopping.flightOffersSearch.get(req.query).then(function(response) {
            res.send({ data: response.data, message: "Success!" });
        }).catch(function(responseError) {
            res.status(501).send({ data: {}, message: `Error occurred! ${responseError.code}` });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ data: {}, message: `Error occurred! ${err}` });
    }
});

router.post('/offers/search', async(req, res) => {

});

router.post('/offers/pricing', async(req, res) => {

});

module.exports = { router };
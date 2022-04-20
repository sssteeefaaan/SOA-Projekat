"use strict";

require('dotenv').config({ path: "docker-compose.env" });

const clientId = process.env.AMADEUS_CLIENT_ID;
const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

const amadeus = new(require('amadeus'))({ clientId, clientSecret });

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
    name: "flights",

    /**
     * Settings
     */
    settings: {

    },

    /**
     * Dependencies
     */
    dependencies: [],

    /**
     * Actions
     */
    actions: {

        /**
         * To retrieve a flight order based on its id.
         */
        getOrder: {
            rest: {
                method: 'GET',
                path: '/order'
            },
            params: {
                orderId: "string"
            },
            async handler(ctx) {
                try {
                    if (!ctx.params.orderId)
                        throw "orderId required!";
                    return amadeus.booking.flightOrder
                        .get(ctx.params.orderId)
                        .then(response => ({ data: response.data, message: "Success!" }))
                        .catch(err => ({ data: {}, message: `Error occurred! ${err}` }));

                } catch (err) {
                    return { data: {}, message: `Error occurred! ${err}` };
                }
            }
        },

        /**
         * To cancel a flight order based on its id.
         */
        deleteOrder: {
            rest: {
                method: "DELETE",
                path: '/order/delete'
            },
            params: {
                orderId: "string"
            },
            async handler(ctx) {
                try {
                    if (!ctx.params.orderId)
                        throw "orderId required!";
                    return amadeus.booking.flightOrder
                        .delete(ctx.params.orderId)
                        .then(response => ({ data: response.data, message: "Success!" }))
                        .catch(err => ({ data: {}, message: `Error occurred! ${err}` }));

                } catch (err) {
                    return { data: {}, message: `Error occurred! ${err}` };
                }
            }
        },

        /**
         * To book the selected flight-offer and create a flight-order
         */
        bookOrder: {
            rest: {
                method: "POST",
                path: '/order/book'
            },
            params: {
                flightOffers: "string",
                travelers_info: "string"
            },
            async handler(ctx) {
                try {
                    if (!ctx.params.flightOffers)
                        throw "flightOffers required!";

                    if (!ctx.params.travelers_info)
                        throw "travelers_info required!";

                    return amadeus.booking.flightOrders.post({
                            'type': 'flight-order',
                            'flightOffers': ctx.params.flightOffers,
                            'travelers_info': ctx.params.travelers_info
                        })
                        .then(response => ({ data: response.data, message: "Success!" }))
                        .catch(err => ({ data: {}, message: `Error occurred! ${err}` }));

                } catch (err) {
                    return { data: {}, message: `Error occurred! ${err}` };
                }
            }
        },

        /**
         * Get available seats in different fare classes
         */
        availabilities: {
            rest: {
                method: 'GET',
                path: '/availabilities'
            },
            async handler(ctx) {
                try {
                    return amadeus.shopping.availability.flightAvailabilities
                        .post(ctx.params)
                        .then(response => ({ data: response.data, message: "Success!" }))
                        .catch(err => ({ data: {}, message: `Error occurred! ${err}` }));

                } catch (err) {
                    return { data: {}, message: `Error occurred! ${err}` };
                }
            }
        },

        /**
         * Find the cheapest flight dates from an origin to a destination.
         */
        dates: {
            rest: {
                method: 'GET',
                path: '/dates'
            },
            params: {
                origin: "string",
                destination: "string"
            },
            async handler(ctx) {
                try {
                    return amadeus.shopping.flightDates
                        .get(ctx.params)
                        .then(response => ({ data: response.data, message: "Success!" }))
                        .catch(err => ({ data: {}, message: `Error occurred! ${err}` }));

                } catch (err) {
                    return { data: {}, message: `Error occurred! ${err}` };
                }
            }
        },

        /**
         * Find the cheapest destinations where you can fly to.
         */
        destinations: {
            rest: {
                method: 'GET',
                path: '/destinations'
            },
            params: {
                origin: "string"
            },
            async handler(ctx) {
                try {
                    return amadeus.shopping.flightDestinations
                        .get(ctx.params)
                        .then(response => ({ data: response.data, message: "Success!" }))
                        .catch(err => ({ data: {}, message: `Error occurred! ${err}` }));

                } catch (err) {
                    return { data: {}, message: `Error occurred! ${err}` };
                }
            }
        },

        /**
         * Get cheapest flight recommendations and prices on a given journey.
         */
        search: {
            rest: {
                method: 'GET',
                path: '/offers/search'
            },
            params: {
                originLocationCode: "string",
                destinationLocationCode: "string",
                departureDate: "string",
                adults: "string"
            },
            async handler(ctx) {
                try {
                    if (!(ctx.params.originLocationCode && ctx.params.destinationLocationCode && ctx.params.departureDate && ctx.params.adults))
                        return { data: {}, message: "Invalid parameters!" };

                    return amadeus.shopping.flightOffersSearch
                        .get(ctx.params)
                        .then(function(response) {
                            return { data: response.data, message: "Success!" };
                        })
                        .catch(function(responseError) {
                            return { data: {}, message: `Error occurred! ${responseError.code}` };
                        });
                } catch (err) {
                    console.log(err);
                    return { data: {}, message: `Error occurred! ${err}` };
                }
            }
        },


        /**
         * To get or confirm the price of a flight and obtain information about taxes and fees to be applied to the entire journey.
         * It also retrieves ancillary information (e.g. additional bag or extra legroom seats pricing) and the payment information details requested at booking time.
         */
        pricing: {
            rest: {
                method: 'GET',
                path: '/offers/pricing'
            },
            params: {
                flightOffers: "string"
            },
            async handler(ctx) {
                try {
                    return amadeus.shopping.flightOffers.pricing.post({
                            'data': {
                                'type': 'flight-offers-pricing',
                                'flightOffers': ctx.params.flightOffers
                            }
                        })
                        .then(response => ({ data: response.data, message: "Success!" }))
                        .catch(err => ({ data: {}, message: `Error occurred! ${err}` }));

                } catch (err) {
                    return { data: {}, message: `Error occurred! ${err}` };
                }
            }
        }
    },

    /**
     * Events
     */
    events: {

    },

    /**
     * Methods
     */
    methods: {

    },

    /**
     * Service created lifecycle event handler
     */
    created() {

    },

    /**
     * Service started lifecycle event handler
     */
    async started() {

    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};

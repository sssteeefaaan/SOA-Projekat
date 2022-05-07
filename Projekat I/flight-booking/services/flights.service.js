"use strict";

require("dotenv").config({ path: "docker-compose.env" });

const clientId = process.env.AMADEUS_CLIENT_ID;
const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

const Amadeus = require("amadeus");
const amadeus = new Amadeus({ clientId, clientSecret });

const request = require('request');

const { MoleculerError } = require("moleculer").Errors;

/**
 * @typedef {import("moleculer").Context} Context Moleculer"s Context
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
         * Returns a list of cities matching a given keyword.
         */
        getCities: {
            rest: {
                methods: "GET",
                path: "/cities"
            },
            params: {
                keyword: { type: "string", min: 1 },
                username: { type: "string", min: 2 }
            },
            async handler(ctx) {
                try {
                    console.log("Params:", ctx.params);
                    return amadeus.referenceData.locations.get({
                            keyword: ctx.params.keyword,
                            subType: Amadeus.location.city
                        })
                        .then(response => {
                            this.broker.emit("gateway.note", {
                                measurement: "user-request",
                                tags: {
                                    group: ["city-search"]
                                },
                                fields: {
                                    ...ctx.params
                                }
                            });
                            return { data: response.data, message: "Success!" };
                        })
                        .catch(err => {
                            this.logger.info(err);
                            throw new MoleculerError("Server side error occurred!", 500);
                        });

                } catch (err) {
                    this.logger.info(err);
                    throw new MoleculerError("Server side error occurred!", 500);
                }
            }
        },

        /**
         * Returns a list of airports matching a given keyword.
         */
        getAirports: {
            rest: {
                methods: "GET",
                path: "/airports-keyword"
            },
            params: {
                keyword: { type: "string", min: 1 },
                username: { type: "string", min: 2 }
            },
            async handler(ctx) {
                try {
                    return amadeus.referenceData.locations.get({
                            keyword: ctx.params.keyword,
                            subType: Amadeus.location.airport
                        })
                        .then(response => {
                            this.broker.emit("gateway.note", {
                                measurement: "user-request",
                                tags: {
                                    group: ["airports-search"]
                                },
                                fields: {
                                    ...ctx.params
                                }
                            });
                            return { data: response.data, message: "Success!" }
                        })
                        .catch(err => {
                            this.logger.info(err);
                            throw new MoleculerError("Server side error occurred!", 500);
                        });

                } catch (err) {
                    this.logger.info(err);
                    throw new MoleculerError("Server side error occurred!", 500);
                }
            }
        },


        /**
         * Returns a list of relevant airports near to a given point.
         */
        findAirports: {
            rest: {
                methods: "GET",
                path: "/airports-location"
            },
            params: {
                longitude: { type: "string", min: 1 },
                latitude: { type: "string", min: 1 },
                username: { type: "string", min: 2 }
            },
            async handler(ctx) {
                try {
                    return amadeus.referenceData.locations.airports.get({
                            longitude: ctx.params.longitude,
                            latitude: ctx.params.latitude
                        })
                        .then(response => {
                            this.broker.emit("gateway.note", {
                                measurement: "user-request",
                                tags: {
                                    group: ["airports-search"]
                                },
                                fields: {
                                    ...ctx.params
                                }
                            });
                            return { data: response.data, message: "Success!" }
                        })
                        .catch(err => {
                            this.logger.info(err);
                            throw new MoleculerError("Server side error occurred!", 500);
                        });

                } catch (err) {
                    this.logger.info(err);
                    throw new MoleculerError("Server side error occurred!", 500);
                }
            }
        },

        /**
         * Find the cheapest destinations where you can fly to.
         */
        destinations: {
            rest: {
                methods: "GET",
                path: "/destinations"
            },
            params: {
                origin: { type: "string", min: 3, max: 3 },
                username: { type: "string", min: 2 }
            },
            async handler(ctx) {
                try {
                    return amadeus.shopping.flightDestinations
                        .get({
                            origin: ctx.params.origin
                        })
                        .then(response => {
                            this.broker.emit("gateway.note", {
                                measurement: "user-request",
                                tags: {
                                    group: ["destinations"]
                                },
                                fields: {
                                    ...ctx.params
                                }
                            });
                            return { data: response.data, message: "Success!" };
                        })
                        .catch(err => {
                            this.logger.info(err);
                            throw new MoleculerError("Server side error occurred!", 500);
                        });

                } catch (err) {
                    this.logger.info(err);
                    throw new MoleculerError("Server side error occurred!", 500);
                }
            }
        },

        /**
         * Find the cheapest flight dates from an origin to a destination.
         */
        dates: {
            rest: {
                methods: "GET",
                path: "/dates"
            },
            params: {
                origin: { type: "string", min: 3, max: 3 },
                destination: { type: "string", min: 3, max: 3 },
                username: { type: "string", min: 2 }
            },
            async handler(ctx) {
                try {
                    this.logger.info("PARAMS", ctx.params);
                    return amadeus.shopping.flightDates
                        .get({
                            origin: ctx.params.origin,
                            destination: ctx.params.destination
                        })
                        .then(response => {
                            this.broker.emit("gateway.note", {
                                measurement: "user-request",
                                tags: {
                                    group: ["flight-dates"]
                                },
                                fields: {
                                    ...ctx.params
                                }
                            });
                            return { data: response.data, message: "Success!" };
                        })
                        .catch(err => {
                            this.logger.info(err);
                            throw new MoleculerError("Server side error occurred!", 500);
                        });

                } catch (err) {
                    this.logger.info(err);
                    throw new MoleculerError("Server side error occurred!", 500);
                }
            }
        },

        /**
         * Get cheapest flight recommendations and prices on a given journey.
         */
        search: {
            rest: {
                methods: "GET",
                path: "/offers/search"
            },
            params: {
                originLocationCode: { type: "string", min: 3, max: 3 },
                destinationLocationCode: { type: "string", min: 3, max: 3 },
                departureDate: { type: "string", min: 2 },
                adults: { type: "string", min: 1 },
                username: { type: "string", min: 2 }
            },
            timeout: 0,
            async handler(ctx) {
                try {
                    return amadeus.shopping.flightOffersSearch
                        .get({
                            originLocationCode: ctx.params.originLocationCode,
                            destinationLocationCode: ctx.params.destinationLocationCode,
                            departureDate: ctx.params.departureDate,
                            adults: ctx.params.adults
                        })
                        .then(response => {
                            this.broker.emit("gateway.note", {
                                measurement: "flight-search",
                                tags: {
                                    group: ["flight-offer-search"]
                                },
                                fields: {
                                    ...ctx.params
                                }
                            }, { timeout: 0 });
                            return { data: response.data, message: "Success!" };
                        })
                        .catch(err => {
                            this.logger.info(err);
                            throw new MoleculerError("Server side error occurred!", 500);
                        });
                } catch (err) {
                    this.logger.info(err);
                    throw new MoleculerError("Server side error occurred!", 500);
                }
            }
        },

        /**
         * Returns the airline info
         */
        getAirline: {
            rest: {
                methods: "GET",
                path: "/airlines"
            },
            params: {
                airlineCodes: { type: "string", min: 2 },
                username: { type: "string", min: 2 }
            },
            async handler(ctx) {
                try {
                    return amadeus.referenceData.airlines.get({
                            airlineCodes: ctx.params.airlineCodes
                        })
                        .then(response => {
                            this.broker.emit("gateway.note", {
                                measurement: "user-request",
                                tags: {
                                    group: ["airline-search"]
                                },
                                fields: {
                                    ...ctx.params
                                }
                            });
                            return { data: response.data, message: "Success!" };
                        })
                        .catch(err => {
                            this.logger.info(err);
                            throw new MoleculerError("Server side error occurred!", 500);
                        });

                } catch (err) {
                    this.logger.info(err);
                    throw new MoleculerError("Server side error occurred!", 500);
                }
            }
        },

        bookTicket: {
            rest: {
                methods: "POST",
                path: "/book-a-ticket"
            },
            params: {
                username: { type: "string", min: 2 }
            },
            async handler(ctx) {
                try {
                    return await new Promise((resolve, reject) => {
                        try {
                            request.post(`${ process.env.INTERNAL_URL }/book-a-ticket`, {
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(ctx.params)
                            }, (err, resp, body) => {
                                if (resp.statusCode != 200) {
                                    this.logger.info("Error occurred!", err);
                                    reject(resp.statusMessage);
                                }
                                let response;
                                try{
                                    response = JSON.parse(body);
                                }
                                catch(e){
                                    response = body;
                                }
                                resolve({ message: "Success!", data: response });
                            });
                        } catch (err) {
                            reject(err);
                        }
                    });
                } catch (err) {
                    this.logger.info(err);
                    throw new MoleculerError("Server side error occurred!", 500);
                }
            }
        },
		
		bookFlight: {
            rest: {
                methods: "POST",
                path: "/book-a-flight"
            },
            params: {
                username: { type: "string", min: 2 },
				origin: { type: "string", min: 3, max: 3 },
                destination: { type: "string", min: 3, max: 3 },
				departureDate: { type: "string", min: 2 } 
            },
            async handler(ctx) {
                try {
                    return await new Promise((resolve, reject) => {
                        try {
                            request.post(`${ process.env.INTERNAL_URL }/book-a-flight`, {
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(ctx.params)
                            }, (err, resp, body) => {
                                if (resp.statusCode != 200) {
                                    this.logger.info("Error occurred!", err);
                                    reject(resp.statusMessage);
                                }
                                let response;
                                try{
                                    response = JSON.parse(body);
                                }
                                catch(e){
                                    response = body;
                                }
                                resolve({ message: "Success!", data: response });
                            });
                        } catch (err) {
                            reject(err);
                        }
                    });
                } catch (err) {
                    this.logger.info(err);
                    throw new MoleculerError("Server side error occurred!", 500);
                }
            }
        },
		
		changeTicketInfo: {
            rest: {
                methods: "PATCH",
                path: "/change-ticket-info"
            },
            params: {
				ticketId: { type: "string", min: 10 },
				username: { type: "string", min: 2 },
                departureDate: { type: "string", min: 2 }
            },
            async handler(ctx) {
                try {
                    return await new Promise((resolve, reject) => {
                        try {
                            request.patch(`${ process.env.INTERNAL_URL }/change-ticket-info?ticketId=${ ctx.params.ticketId }`, {
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(ctx.params)
                            }, (err, resp, body) => {
                                if (resp.statusCode != 200) {
                                    this.logger.info("Error occurred!", err);
                                    reject(resp.statusMessage);
                                }
                                let response;
                                try{
                                    response = JSON.parse(body);
                                }
                                catch(e){
                                    response = body;
                                }
                                resolve({ message: "Success!", data: response });
                            });
                        } catch (err) {
                            reject(err);
                        }
                    });
                } catch (err) {
                    this.logger.info(err);
                    throw new MoleculerError("Server side error occurred!", 500);
                }
            }
        },

        cancelTicket: {
            rest: {
                methods: "DELETE",
                path: "/cancel-a-ticket"
            },
            params: {
                ticketId: { type: "string", min: 10 }
            },
            async handler(ctx) {
                try {
                    return await new Promise((resolve, reject) => {
                        try {
                            request.delete(`${ process.env.INTERNAL_URL }/cancel-a-ticket?ticketId=${ ctx.params.ticketId }`, (err, resp, body) => {
                                if (resp.statusCode != 200) {
                                    this.logger.info("Error occurred!", err);
                                    reject(resp.statusMessage);
                                }
                                let response;
                                try{
                                    response = JSON.parse(body);
                                }
                                catch(e){
                                    response = body;
                                }
                                resolve({ message: "Success!", data: response });
                            });
                        } catch (err) {
                            reject(err);
                        }
                    });
                } catch (err) {
                    this.logger.info(err);
                    throw new MoleculerError("Server side error occurred!", 500);
                }
            }
        },

        getTicket: {
            rest: {
                methods: "GET",
                path: "/get-ticket"
            },
            params: {
                ticketId: { type: "string", min: 10 }
            },
            async handler(ctx) {
                try {
                    return await new Promise((resolve, reject) => {
                        try {
                            request.get(`${ process.env.INTERNAL_URL }/get-ticket?ticketId=${ ctx.params.ticketId }`, (err, resp, body) => {
                                if (resp.statusCode != 200) {
                                    this.logger.info("Error occurred!", err);
                                    reject(resp.statusMessage);
                                }
                                let response;
                                try{
                                    response = JSON.parse(body);
                                }
                                catch(e){
                                    response = body;
                                }
                                resolve({ message: "Success!", data: response });
                            });
                        } catch (err) {
                            reject(err);
                        }
                    });
                } catch (err) {
                    this.logger.info(err);
                    throw new MoleculerError("Server side error occurred!", 500);
                }
            }
        },

        getTickets: {
            rest: {
                methods: "GET",
                path: "/get-tickets"
            },
            params: {
                username: { type: "string", min: 2 }
            },
            async handler(ctx) {
                try {
                    return await new Promise((resolve, reject) => {
                        try {
                            request.get(`${ process.env.INTERNAL_URL }/get-tickets?username=${ ctx.params.username }`, (err, resp, body) => {
                                if (resp.statusCode != 200) {
                                    this.logger.info("Error occurred!", err);
                                    reject(resp.statusMessage);
                                }
                                let response;
                                try{
                                    response = JSON.parse(body);
                                }
                                catch(e){
                                    response = body;
                                }
                                resolve({ message: "Success!", data: response });
                            });
                        } catch (err) {
                            reject(err);
                        }
                    });
                } catch (err) {
                    this.logger.info(err);
                    throw new MoleculerError("Server side error occurred!", 500);
                }
            }
        },
		
		getFlights: {
            rest: {
                methods: "GET",
                path: "/get-flights"
            },
            params: {
                destination: { type: "string", min: 3, max: 3 }
            },
            async handler(ctx) {
                try {
                    return await new Promise((resolve, reject) => {
                        try {
                            request.get(`${ process.env.INTERNAL_URL }/get-flights?destination=${ ctx.params.destination }`, (err, resp, body) => {
                                if (resp.statusCode != 200) {
                                    this.logger.info("Error occurred!", err);
                                    reject(resp.statusMessage);
                                }
                                let response;
                                try{
                                    response = JSON.parse(body);
                                }
                                catch(e){
                                    response = body;
                                }
                                resolve({ message: "Success!", data: response });
                            });
                        } catch (err) {
                            reject(err);
                        }
                    });
                } catch (err) {
                    this.logger.info(err);
                    throw new MoleculerError("Server side error occurred!", 500);
                }
            }
        },
		
		getFlightsForDate: {
            rest: {
                methods: "GET",
                path: "/get-flights-date"
            },
            params: {
                departureDate: { type: "string", min: 2 }
            },
            async handler(ctx) {
                try {
                    return await new Promise((resolve, reject) => {
                        try {
                            request.get(`${ process.env.INTERNAL_URL }/get-flights-date?departureDate=${ ctx.params.departureDate }`, (err, resp, body) => {
                                if (resp.statusCode != 200) {
                                    this.logger.info("Error occurred!", err);
                                    reject(resp.statusMessage);
                                }
                                let response;
                                try{
                                    response = JSON.parse(body);
                                }
                                catch(e){
                                    response = body;
                                }
                                resolve({ message: "Success!", data: response });
                            });
                        } catch (err) {
                            reject(err);
                        }
                    });
                } catch (err) {
                    this.logger.info(err);
                    throw new MoleculerError("Server side error occurred!", 500);
                }
            }
        },

        // // ***** UNTESTED SECTION *****

        // /**
        //  * To get or confirm the price of a flight and obtain information about taxes and fees to be applied to the entire journey.
        //  * It also retrieves ancillary information (e.g. additional bag or extra legroom seats pricing) and the payment information details requested at booking time.
        //  */
        // pricing: {
        //     rest: {
        //         methods: "POST",
        //         path: "/offers/pricing"
        //     },
        //     params: {
        //         flightOffers: { type: "string" },
        //         username: { type: "string", min: 2 }
        //     },
        //     async handler(ctx) {
        //         try {
        //             return amadeus.shopping.flightOffers.pricing.post({
        //                     data: {
        //                         type: "flight-offers-pricing",
        //                         flightOffers: ctx.params.flightOffers
        //                     }
        //                 })
        //                 .then(response => {
        //                     this.broker.emit("gateway.note", {
        //                         measurement: "user-request",
        //                         tags: {
        //                             group: ["pricing"]
        //                         },
        //                         fields: {
        //                             ...ctx.params
        //                         }
        //                     });
        //                     return { data: response.data, message: "Success!" };
        //                 })
        //                 .catch(err => {
        //                     this.logger.info(err);
        //                     throw new MoleculerError("Server side error occurred!", 500);
        //                 });

        //         } catch (err) {
        //             this.logger.info(err);
        //             throw new MoleculerError("Server side error occurred!", 500);
        //         }
        //     }
        // },

        // /**
        //  * To book the selected flight-offer and create a flight-order
        //  */
        // bookOrder: {
        //     rest: {
        //         methods: "POST",
        //         path: "/order/book"
        //     },
        //     params: {
        //         flightOffers: { type: "string" },
        //         travelers_info: { type: "string" },
        //         username: { type: "string", min: 2 }
        //     },
        //     async handler(ctx) {
        //         try {
        //             return amadeus.booking.flightOrders.post({
        //                     type: "flight-order",
        //                     flightOffers: ctx.params.flightOffers,
        //                     travelers_info: ctx.params.travelers_info
        //                 })
        //                 .then(response => {
        //                     this.broker.emit("gateway.note", {
        //                         measurement: "user-request",
        //                         tags: {
        //                             group: ["booking"]
        //                         },
        //                         fields: {
        //                             ...ctx.params
        //                         }
        //                     });
        //                     return { data: response.data, message: "Success!" }
        //                 })
        //                 .catch(err => {
        //                     this.logger.info(err);
        //                     throw new MoleculerError("Server side error occurred!", 500);
        //                 });

        //         } catch (err) {
        //             this.logger.info(err);
        //             throw new MoleculerError("Server side error occurred!", 500);
        //         }
        //     }
        // },

        // /**
        //  * To retrieve a flight order based on its id.
        //  */
        // getOrder: {
        //     rest: {
        //         methods: "GET",
        //         path: "/order"
        //     },
        //     params: {
        //         orderId: { type: "string", min: 1 },
        //         username: { type: "string", min: 2 }
        //     },
        //     async handler(ctx) {
        //         try {
        //             return amadeus.booking.flightOrder
        //                 .get(ctx.params.orderId)
        //                 .then(response => {
        //                     this.broker.emit("gateway.note", {
        //                         measurement: "user-request",
        //                         tags: {
        //                             group: ["booking-info"]
        //                         },
        //                         fields: {
        //                             ...ctx.params
        //                         }
        //                     });
        //                     return { data: response.data, message: "Success!" }
        //                 })
        //                 .catch(err => {
        //                     this.logger.info(err);
        //                     throw new MoleculerError("Server side error occurred!", 500);
        //                 });

        //         } catch (err) {
        //             this.logger.info(err);
        //             throw new MoleculerError("Server side error occurred!", 500);
        //         }
        //     }
        // },

        // /**
        //  * To cancel a flight order based on its id.
        //  */
        // deleteOrder: {
        //     rest: {
        //         methods: "DELETE",
        //         path: "/order/delete"
        //     },
        //     params: {
        //         orderId: { type: "string", min: 1 },
        //         username: { type: "string", min: 2 }
        //     },
        //     async handler(ctx) {
        //         try {
        //             return amadeus.booking.flightOrder
        //                 .delete(ctx.params.orderId)
        //                 .then(response => {
        //                     this.broker.emit("gateway.note", {
        //                         measurement: "user-request",
        //                         tags: {
        //                             group: ["booking-cancel"]
        //                         },
        //                         fields: {
        //                             ...ctx.params
        //                         }
        //                     });
        //                     return { data: response.data, message: "Success!" }
        //                 })
        //                 .catch(err => {
        //                     this.logger.info(err);
        //                     throw new MoleculerError("Server side error occurred!", 500);
        //                 });

        //         } catch (err) {
        //             this.logger.info(err);
        //             throw new MoleculerError("Server side error occurred!", 500);
        //         }
        //     }
        // },

        // /**
        //  * Get available seats in different fare classes
        //  */
        // availabilities: {
        //     rest: {
        //         methods: "GET",
        //         path: "/availabilities"
        //     },
        //     params: {
        //         username: { type: "string", min: 3 }
        //     },
        //     async handler(ctx) {
        //         try {
        //             return amadeus.shopping.availability.flightAvailabilities
        //                 .post(ctx.params)
        //                 .then(response => {
        //                     this.broker.emit("gateway.note", {
        //                         measurement: "user-request",
        //                         tags: {
        //                             group: ["availabilities"]
        //                         },
        //                         fields: {
        //                             ...ctx.params
        //                         }
        //                     });
        //                     return { data: response.data, message: "Success!" }
        //                 }).catch(err => {
        //                     this.logger.info(err);
        //                     throw new MoleculerError("Server side error occurred!", 500);
        //                 });

        //         } catch (err) {
        //             this.logger.info(err);
        //             throw new MoleculerError("Server side error occurred!", 500);
        //         }
        //     }
        // },
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
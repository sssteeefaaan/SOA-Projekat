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
                method: "GET",
                path: "/cities"
            },
            params: {
                keyword: { type: "string", min: 1 },
                username: { type: "string", min: 2 }
            },
            async handler(ctx) {
                try {
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
        getAirportsByName: {
            rest: {
                method: "GET",
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
        getAirportsByLocation: {
            rest: {
                method: "GET",
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
        getDestinations: {
            rest: {
                method: "GET",
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
        getDates: {
            rest: {
                method: "GET",
                path: "/dates"
            },
            params: {
                origin: { type: "string", min: 3, max: 3 },
                destination: { type: "string", min: 3, max: 3 },
                username: { type: "string", min: 2 }
            },
            async handler(ctx) {
                try {
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
        getFlightOffers: {
            rest: {
                method: "GET",
                path: "/offers"
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
        getAirlines: {
            rest: {
                method: "GET",
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
		
        /**
         * Creates a ticket for a given user and their flight offer
         */
		bookATicket: {
            rest: {
                method: "POST",
                path: "/tickets"
            },
            params: {
                username: { type: "string", min: 2 },
                ticketOffer: { type: "object" }
            },
            async handler(ctx) {
                try {
                    const ticketOffer = ctx.params.ticketOffer;
                    const segments = ticketOffer['itineraries'][0]['segments'];
                    const reqBody = {
                        ...ctx.params,
                        departureDate: new Date(segments[0]['departure']['at']),
                        arrivalDate: new Date(segments[segments.length - 1]['arrival']['at'])
                    };
                    this.logger.info("REQUEST BODY", reqBody);
                    return await new Promise((resolve, reject) => {
                        try {
                            request.post(`${ process.env.INTERNAL_URL }/tickets/create`, {
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(reqBody)
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
		
        /**
         * Changes flight details
         */
		updateATicket: {
            rest: {
                method: "PATCH",
                path: "/tickets"
            },
            params: {
				ticketId: { type: "string", min: 10 },
				username: { type: "string" },
                departureDate: { type: "string" },
                arrivalDate: { type: "string" },
                info: { type: "string" }
            },
            async handler(ctx) {
                try {
                    const reqBody = { ...ctx.params };
                    if(reqBody['departureDate'])
                        reqBody['departureDate'] = (new Date(reqBody['departureDate'])).toISOString()
                    if(reqBody['arrivalDate'])
                        reqBody['arrivalDate'] = (new Date(reqBody['arrivalDate'])).toISOString()
                    return await new Promise((resolve, reject) => {
                        try {
                            request.patch(`${ process.env.INTERNAL_URL }/tickets/update`, {
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(reqBody)
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

        /**
         * Deletes a booked ticket
         */
        cancelATicket: {
            rest: {
                method: "DELETE",
                path: "/tickets/:ticketId"
            },
            params: {
                ticketId: { type: "string", min: 10 }
            },
            async handler(ctx) {
                try {
                    return await new Promise((resolve, reject) => {
                        try {
                            request.delete(`${ process.env.INTERNAL_URL }/tickets/delete/${ ctx.params.ticketId }`, (err, resp, body) => {
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

        /**
         * Returns a specific ticket
         */
        getATicket: {
            rest: {
                method: "GET",
                path: "/tickets/:ticketId"
            },
            params: {
                ticketId: { type: "string", min: 10 }
            },
            async handler(ctx) {
                try {
                    return await new Promise((resolve, reject) => {
                        try {
                            request.get(`${ process.env.INTERNAL_URL }/tickets/${ ctx.params.ticketId }`, (err, resp, body) => {
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

        /**
         * Returns all tickets for a specific user
         */
        getTickets: {
            rest: {
                method: "GET",
                path: "/myTickets/:username"
            },
            params: {
                username: { type: "string", min: 2 }
            },
            async handler(ctx) {
                try {
                    return await new Promise((resolve, reject) => {
                        try {
                            request.get(`${ process.env.INTERNAL_URL }/tickets/user/${ ctx.params.username }`, (err, resp, body) => {
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


        /**
         * Returns all notifications for a specified username.
         */
        getNotifications: {
            rest: {
                method: "GET",
                path: "/notifications/:username"
            },
            params: {
                username: { type: "string", min: 1 }
            },
            async handler(ctx) {
                try {
                    return await new Promise((resolve, reject) => {
                        try {
                            request.get(`${ process.env.INTERNAL_URL }/notifications/${ ctx.params.username }`, (err, resp, body) => {
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
        }
    },

    /**
     * Events
     */
    events: {

    },

    /**
     * method
     */
    method: {

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
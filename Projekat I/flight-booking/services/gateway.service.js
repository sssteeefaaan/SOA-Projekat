"use strict";

require('dotenv').config({ path: "docker-compose.env" });

const ApiGateway = require("moleculer-web");
const request = require('request');

const MAX_WIND = 15;
const MAX_PRECIPITATION = 20;

const { MoleculerError } = require("moleculer").Errors;

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 */

module.exports = {
    name: "gateway",
    mixins: [ApiGateway],

    // More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
    settings: {
        // Exposed port
        port: process.env.PORT || 3000,

        // Exposed IP
        ip: "0.0.0.0",

        // Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
        use: [],

        routes: [{
            path: "/api",

            whitelist: [
                "**"
            ],

            // Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
            use: [],

            // Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
            mergeParams: true,

            // Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
            authentication: false,

            // Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
            authorization: false,

            // The auto-alias feature allows you to declare your route alias directly in your services.
            // The gateway will dynamically build the full routes from service schema.
            autoAliases: true,

            aliases: {

            },

            /**
             * Before call hook. You can check the request.
             * @param {Context} ctx
             * @param {Object} route
             * @param {IncomingRequest} req
             * @param {ServerResponse} res
             * @param {Object} data
             *
            onBeforeCall(ctx, route, req, res) {
            	// Set request headers to context meta
            	ctx.meta.userAgent = req.headers["user-agent"];
            }, */

            /**
             * After call hook. You can modify the data.
             * @param {Context} ctx
             * @param {Object} route
             * @param {IncomingRequest} req
             * @param {ServerResponse} res
             * @param {Object} data
            onAfterCall(ctx, route, req, res, data) {
            	// Async function which return with Promise
            	return doSomething(ctx, res, data);
            }, */

            // Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
            callingOptions: {},

            bodyParsers: {
                json: {
                    strict: false,
                    limit: "1MB"
                },
                urlencoded: {
                    extended: true,
                    limit: "1MB"
                }
            },

            // Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
            mappingPolicy: "all", // Available values: "all", "restrict"

            // Enable/disable logging
            logging: true
        }],

        // Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
        log4XXResponses: false,
        // Logging the request parameters. Set to any log level to enable it. E.g. "info"
        logRequestParams: null,
        // Logging the response data. Set to any log level to enable it. E.g. "info"
        logResponseData: null,


        // Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
        assets: {
            folder: "public",

            // Options to `server-static` module
            options: {}
        },

        cors: {
            methods: ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"],
            origin: "*",
        }
    },

    methods: {
        badWeatherConditions(data) {
            return data['wind'] > MAX_WIND || data['precipitation'] > MAX_PRECIPITATION;
        },
        delayFlights(data) {
            try {
                new Promise((resolve, reject) => {
                    try {
                        request.post(`${ process.env.INTERNAL_URL }/delay-flights`, {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
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
                })
                .catch(res => this.logger.info(res));
            } catch (err) {
                this.logger.info(err);
                throw new MoleculerError("Server side error occurred!", 500);
            }
        },
        logWeather(data) {
            try {
                new Promise((resolve, reject) => {
                    try {
                        request.post(`${ process.env.INTERNAL_URL }/weather`, {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        }, (err, resp, body) => {
                            if (resp.statusCode != 200) {
                                this.logger.info("Error occurred here", resp.statusMessage);
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
                })
                .catch(res => this.logger.info(res));
            } catch (err) {
                this.logger.info(err);
                throw new MoleculerError("Server side error occurred!", 500);
            }
        }
    },

    events: {
        "gateway.weather-reading": {
            group: "weather",
            async handler(ctx){
                try {
                    const data = ctx.params;
                    this.logWeather(data);
                    if(this.badWeatherConditions(data))
                        this.delayFlights(data);
                }
                catch (err) {
                    this.logger.info(err);
                    throw new MoleculerError("Server side error occurred!", 500);
                }
            }
        },

        "gateway.note": {
            group: "communication",
            async handler(ctx) {
                try {
                    return await new Promise((resolve, reject) => {
                        try {
                            request.post(process.env.INTERNAL_URL + "/writeDB", {
                                headers: {
                                     'Content-Type': 'application/json' 
                                    },
                                body: JSON.stringify(ctx.params)
                            }, (err, resp, body) => {
                                if (resp.statusCode != 200) {
                                    this.logger.info("Error occurred!", err);
                                    reject(resp.statusMessage);
                                }
                                try { 
                                    resolve({ message: "Success!", data: JSON.parse(body) });
                                }
                                catch(_){
                                    resolve({ message: "Success!", data: body });
                                }
                            });
                        }
                        catch(err) {
                            reject(err);
                        }
                    });
                }
                catch (err) {
                    this.logger.info(err);
                    throw new MoleculerError("Server side error occurred!", 500);
                }
            }
        }
    },
};
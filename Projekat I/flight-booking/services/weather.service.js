"use strict";

require("dotenv").config({ path: "docker-compose.env" });

const request = require('request');
const fs = require('fs');
const csv = require('csv-parser');
const { Context } = require("moleculer");
const mqtt = require("mqtt");
const CSV_FILE = process.env.CSV_FILE;

const { MoleculerError } = require("moleculer").Errors;

/**
 * @typedef {import("moleculer").Context} Context Moleculer"s Context
 */

module.exports = {
    name: "weather",

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
         * Starts reading from a file
         */
        startReading: {
            rest: {
                method: "PUT",
                path: "/start"
            },
            async handler(ctx) {
                try{
                    this.readFile();
                    return { message: "Success!", data: {} };
                } catch (err) {
                    this.logger.info(err);
                    throw new MoleculerError("Server side error occurred!", 500);
                }
            }
        },

        getForecat: {
            rest: {
                method: "GET",
                path: "/forecast/:startDate/:endDate"
            },
            params: {
                startDate: { type: "string" },
                endDate: { type: "string" }
            },
            async handler(ctx) {
                return await new Promise((resolve, reject) => {
                    try {
                        request.get(`${ process.env.INTERNAL_URL }/weather/${ (new Date(ctx.params.startDate)).toISOString() }/${ (new Date(ctx.params.endDate)).toISOString() }`, 
                        (err, resp, body) => {
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
        readFile(){
            const dataset = []
            fs.createReadStream(CSV_FILE)
            .pipe(csv())
            .on('data', data => {
                const date = new Date(data['date']);
                date.setFullYear(date.getFullYear() + 9);
                ['precipitation', 'temp_min', 'temp_max', 'wind'].forEach(el => data[el] = Number(data[el]));
                dataset.push({...data, date: date.toISOString() });
            })
            .on('end', () => {
                let index = 0;
                const timeout = setInterval(() => {
                    this.broker.emit('gateway.weather-reading', dataset[index]);
                    this.mosquitto.publish(process.env.PUBLISH_TOPIC, JSON.stringify(dataset[index]));
                    index += 1;
                    if(index == dataset.length)
                        clearInterval(timeout);
                }, 5000);
            })
            .on('error', (error) => this.logger.info('Error occurred here', error));
        }
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
        this.logger.info('Connecting to mosquitto...', process.env.MOSQUITTO_URL);
        this.mosquitto = mqtt.connect(process.env.MOSQUITTO_URL, { /*clientId: 'weather-service',*/ connectTimeout: 60 * 1000 });
        this.mosquitto.on('connect', () => {
            this.logger.info("Connected to mosquitto!");
        });
    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
"use strict";

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECOND = 5000;
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log(`Number of connections: ${numConnection}`);
}
export const checkOverLoad = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCore = os.cpus().length; // number of core of CPU
        const memoryUsage = process.memoryUsage().rss; // memory usage of process (bytes)
        // Example maximum number of connection based on number of cores
        const maximumConnection = numCore * 5; // Ex: with 1 core, maximum connection is 5
        console.log(`Active connection: ${numConnection}`);
        console.log(`Memory usage of process: ${memoryUsage / 1024 / 1024} MB`)
        if(numConnection > maximumConnection){
            console.log(`Number of connections is over ${maximumConnection}`);
        }
    }, _SECOND); // monitor every 5s
}
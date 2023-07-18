"use strict";
require('dotenv').config();
const mongoose = require('mongoose');
const {countConnect} = require('../helpers/checkConnect');
const connectString = process.env.MONGO_URI;

// singleton pattern
class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        if (1 === 1) { // dev env
            mongoose.set('debug', true);
            mongoose.set('debug', {color: true});
        }
        mongoose.connect(connectString, {
            maxPoolSize : 50
        }).then(_ => {
            console.log('Database MongoDB connection successful');
            // countConnect();
        }).catch((err) => {
            console.log('Database MongoDB connection error');
        });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;

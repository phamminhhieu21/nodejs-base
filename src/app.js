const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const compression = require('compression');
const {default: helmet} = require('helmet');
import cors from 'cors';
import initRoutes from './routes'
import {checkOverLoad} from './helpers/checkConnect'
require('dotenv').config();
require('../passport'); // passport.js is a file that contains the configuration for passport (passport is a middleware for authentication)

const app = express();

//* init middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    sameSite: "none",
    //secure: true // enable set cookie
}));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev')); // log every request to the console (dev: Concise output colored by response status for development use)
app.use(helmet()); // secure apps by setting various HTTP headers
app.use(compression()); // compress all responses (gzip compression)

//* init database
// connect to sql
require('../connection');
// connect to mongodb
// require('./dbs/init.mongodb')
// checkOverLoad();

//* init routes
initRoutes(app)

//* handling error

module.exports = app;
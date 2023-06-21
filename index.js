const express = require('express');
import cors from 'cors';
require('dotenv').config();
require('./passport'); // passport.js is a file that contains the configuration for passport (passport is a middleware for authentication)
var cookieParser = require('cookie-parser');
import initRoutes from './src/routes'

const port = process.env.PORT || 5000;
//* connecting database
require('./connection');

const app = express();
app.use(cookieParser())
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST','PUT','DELETE'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initRoutes(app)

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
} );
const express = require('express');
// const cors = require('cors');
import cors from 'cors';
require('dotenv').config();
// const initRoutes = require('./src/routes');
import initRoutes from './src/routes'

const port = process.env.PORT || 5000;
//* connecting database
require('./connection');

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST','PUT','DELETE'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initRoutes(app)

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
} );
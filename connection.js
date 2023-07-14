const { Sequelize } = require('sequelize');
import {dbConfig} from './src/config/db.config';
import mysql2 from 'mysql2';
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port, // The port of the relational database, MySQL is 3306 by default
  dialect: 'mysql',
  dialectModule: mysql2, // To use mysql2 module instead of mysql module
  logging: false,
  pool: {
    max: 10,
    min: 0,
    idle: 30000,
    // evict: 2000,
    // acquire: 1000000,
  },
  // 5 seconds to release a connection back to the pool after it has been evicted in idle state (unused in the pool)
  dialectOptions: {
    decimalNumbers: true, // Prevents sequelize from converting decimals to strings when fetching data from database
  },
});

const connectionDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to MySQL has been established successfully.');
  } catch (error) {
    console.log('Unable to connect to the database:', error);
  } 
}
connectionDatabase();
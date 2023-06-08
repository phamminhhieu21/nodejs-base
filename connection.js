const { Sequelize } = require('sequelize');
import {dbConfig} from './src/config/db.config';
import mysql2 from 'mysql2';
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: 'mysql',
  dialectModule: mysql2,
  logging: false,
});

const connectionDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.log('Unable to connect to the database:', error);
  } 
}
connectionDatabase();
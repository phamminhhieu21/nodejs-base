'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Medias', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
        // autoIncrement: true,
      },
      userId : {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      photo : {
        type: Sequelize.STRING,
        allowNull: true
      },
      filename : {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')  
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Medias');
  }
};
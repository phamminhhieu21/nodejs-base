'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Media.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        as: 'userData',
      })
    }
  }
  Media.init({
    userId : DataTypes.INTEGER,
    photo: DataTypes.STRING,
    filename : DataTypes.STRING
  }, {
    sequelize,
    tableName: 'Medias',
  });
  return Media;
};
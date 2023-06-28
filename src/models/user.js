'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, { foreignKey: 'role_code', targetKey: 'code', as: 'roleData' })
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    phone_number : DataTypes.STRING,
    role_code: DataTypes.STRING,
    gender: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    typeLogin: DataTypes.STRING,
    tokenLogin: DataTypes.STRING,
    refresh_token: DataTypes.STRING,
    idGoogle: DataTypes.STRING,
    filenameAvatar: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    static associate(models) {
      // define association here
      User.hasOne(models.Biodata,{
        foreignKey:"user_id",
        as: "biodata"
      });

      User.hasMany(models.History,{
        foreignKey: "user_id",
        as:"histories"
      });

    }
  }
  User.init({
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    role: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
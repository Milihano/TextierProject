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
    }
  }
  User.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    customer_id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    fullname: {
      allowNull: false,
      type: DataTypes.STRING
    },
    username: {
      allowNull: false,
      uniqueKey:true,
      type: DataTypes.STRING
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      allowNull: false,
      uniqueKey:true,
      type: DataTypes.STRING
    },
    is_email_verified: {
      type:DataTypes.BOOLEAN,
      defaultValue: false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    dob: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    country: {
      type: DataTypes.STRING,
      defaultValue: null
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
'use strict';

const { TRUE } = require('node-sass');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      fullname: {
        allowNull: false,
        type: Sequelize.STRING
      },
      username: {
        allowNull: false,
        uniqueKey:true,
        type: Sequelize.STRING
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password_salt: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        allowNull: false,
        uniqueKey:true,
        type: Sequelize.STRING
      },
      is_email_verified : {
        type: Sequelize.BOOLEAN,
        defaultValue : false
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      is_phone_number_verified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dob: {
        type: Sequelize.STRING,
        allowNull: false
      },
      country: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
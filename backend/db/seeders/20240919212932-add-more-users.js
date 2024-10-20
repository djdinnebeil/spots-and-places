'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'djdinnebeil@gmail.com',
        username: 'djdinnebeil',
        firstName: 'DJ',
        lastName: 'Dinnebeil',
        hashedPassword: bcrypt.hashSync('admin6')
      },
      {
        email: 'daniel.dinnebeil@gmail.com',
        username: 'danieldinnebeil',
        firstName: 'Daniel',
        lastName: 'Dinnebeil',
        hashedPassword: bcrypt.hashSync('admin6')
      },
      {
        email: 'jose.arrunategui@gmail.com',
        username: 'josearrunategui',
        firstName: 'Jose',
        lastName: 'Arrunategui',
        hashedPassword: bcrypt.hashSync('admin6')
      },
      {
        email: 'tabby@cats.com',
        username: 'tabby',
        firstName: 'Tabby',
        lastName: 'Dinnebeil',
        hashedPassword: bcrypt.hashSync('admin6')
      }
    ], { validate: true });
  },
  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['josearrunategui', 'tabby', 'djdinnebeil', 'danieldinnebeil'] }
    }, {});
  }
};

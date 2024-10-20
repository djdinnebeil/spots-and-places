'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    return Spot.bulkCreate([
      {
        ownerId: 1,
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'United States of America',
        lat: 40.712776,
        lng: -74.005974,
        name: 'Cozy Manhattan Apartment',
        description: 'A cozy apartment in the heart of Manhattan.',
        price: 150.00
      },
      {
        ownerId: 2,
        address: '456 Ocean Ave',
        city: 'Los Angeles',
        state: 'CA',
        country: 'United States of America',
        lat: 34.052235,
        lng: -118.243683,
        name: 'Beachfront House',
        description: 'A beautiful house right by the beach.',
        price: 500.00
      },
      {
        ownerId: 3,
        address: '789 Mountain Dr',
        city: 'Denver',
        state: 'CO',
        country: 'United States of America',
        lat: 39.739235,
        lng: -104.990250,
        name: 'Mountain Cabin',
        description: 'A rustic cabin in the mountains.',
        price: 300.00
      },
      {
        ownerId: 1,
        address: '101 Lake View',
        city: 'Austin',
        state: 'TX',
        country: 'United States of America',
        lat: 30.267153,
        lng: -97.743057,
        name: 'Lakeside Villa',
        description: 'A luxurious villa with a stunning lake view.',
        price: 400.00
      },
      {
        ownerId: 2,
        address: '202 Forest Rd',
        city: 'Seattle',
        state: 'WA',
        country: 'United States of America',
        lat: 47.606209,
        lng: -122.332069,
        name: 'Forest Retreat',
        description: 'A secluded retreat surrounded by forest.',
        price: 200.00
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['123 Main St', '456 Ocean Ave', '789 Mountain Dr', '101 Lake View', '202 Forest Rd'] }
    });
  }
};

'use strict';

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: '2024-10-01',
        endDate: '2024-10-07'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2024-11-05',
        endDate: '2024-11-12'
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2024-09-15',
        endDate: '2024-09-20'
      },
      {
        spotId: 1,
        userId: 4,
        startDate: '2024-12-01',
        endDate: '2024-12-10'
      },
      {
        spotId: 5,
        userId: 5,
        startDate: '2024-10-20',
        endDate: '2024-10-25'
      },
      {
        spotId: 8,
        userId: 2,
        startDate: '2024-10-20',
        endDate: '2024-10-25'
      },
      {
        spotId: 8,
        userId: 4,
        startDate: '2024-10-18',
        endDate: '2024-10-31'
      },
      {
        spotId: 8,
        userId: 5,
        startDate: '2024-10-18',
        endDate: '2024-10-31'
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 5, 8] },
      userId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};

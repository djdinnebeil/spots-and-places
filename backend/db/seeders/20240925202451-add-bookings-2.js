'use strict';

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate([
      /* not updated for deletion */
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
      spotId: { [Op.in]: [8] },
      userId: { [Op.in]: [2, 4, 5] }
    }, {});
  }
};

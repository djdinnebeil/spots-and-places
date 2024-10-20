'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 3,
        userId: 4,
        review: 'Cool spot!',
        stars: 4,
      },
      {
        spotId: 2,
        userId: 2,
        review: 'Not too bad.',
        stars: 3,
      },

    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: {
        [Op.in]: [
          'Cool spot!',
          'Not too bad.',
        ]
      }
    }, {});
  }
};

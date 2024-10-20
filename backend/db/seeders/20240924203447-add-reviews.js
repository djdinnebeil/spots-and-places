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
        spotId: 1,
        userId: 6,
        review: 'Great spot, had an amazing time!',
        stars: 5,
      },
      {
        spotId: 2,
        userId: 1,
        review: 'Not bad, but could be better.',
        stars: 3,
      },
      {
        spotId: 1,
        userId: 3,
        review: 'Wonderful experience, would visit again!',
        stars: 4,
      },
      {
        spotId: 3,
        userId: 1,
        review: 'Could have been nicer, but overall nice.',
        stars: 2,
      },
      {
        spotId: 1,
        userId: 2,
        review: 'Overall nice.',
        stars: 4,
      },
      {
        spotId: 1,
        userId: 4,
        review: 'Very nice.',
        stars: 5,
      },
      {
        spotId: 6,
        userId: 5,
        review: 'Very nice 2.',
        stars: 5,
      },
      {
        spotId: 6,
        userId: 6,
        review: 'Very, very nice.',
        stars: 5,
      },
      {
        spotId: 7,
        userId: 5,
        review: 'Ocean City is awesome!',
        stars: 5,
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: {
        [Op.in]: [
          'Great spot, had an amazing time!',
          'Not bad, but could be better.',
          'Wonderful experience, would visit again!',
          'Could have been nicer, but overall nice.',
          'Overall nice.',
          'Very nice.',
          'Very nice 2.',
          'Very, very nice.',
          'Ocean City is awesome!',
        ]
      }
    }, {});
  }
};

'use strict';

const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 9,
        url: 'https://example.com/review9-image1.jpg',
      },
      {
        reviewId: 10,
        url: 'https://example.com/review10-image1.jpg',
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkDelete(options, {}, {});
  }
};

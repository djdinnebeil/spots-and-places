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
        reviewId: 1,
        url: 'https://example.com/review1-image1.jpg',
      },
      {
        reviewId: 1,
        url: 'https://example.com/review1-image2.jpg',
      },
      {
        reviewId: 2,
        url: 'https://example.com/review2-image1.jpg',
      },
      {
        reviewId: 3,
        url: 'https://example.com/review3-image1.jpg',
      },
      {
        reviewId: 4,
        url: 'https://example.com/review4-image1.jpg',
      },
      {
        reviewId: 5,
        url: 'https://example.com/review5-image1.jpg',
      },
      {
        reviewId: 6,
        url: 'https://example.com/review6-image1.jpg',
      },
      {
        reviewId: 7,
        url: 'https://example.com/review7-image1.jpg',
      },
      {
        reviewId: 7,
        url: 'https://example.com/review7-image2.jpg',
      },
      {
        reviewId: 8,
        url: 'https://example.com/review8-image1.jpg',
      },


    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkDelete(options, {}, {});
  }
};

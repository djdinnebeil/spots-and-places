'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/1-0-manhattan.jpg',
        preview: true,
      },
      {
        spotId: 1,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/1-1-manhattan.jpg',
        preview: false,
      },
      {
        spotId: 1,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/1-2-manhattan.jpg',
        preview: false,
      },
      {
        spotId: 1,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/1-3-manhattan.jpg',
        preview: false,
      },
      {
        spotId: 1,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/1-4-manhattan.jpg',
        preview: false,
      },
      {
        spotId: 1,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/1-5-manhattan.jpg',
        preview: false,
      },
      {
        spotId: 2,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/2-0-los-angeles.jpg',
        preview: true,
      },
      {
        spotId: 2,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/2-1-los-angeles.jpg',
        preview: false,
      },
      {
        spotId: 2,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/2-2-los-angeles.jpg',
        preview: false,
      },
      {
        spotId: 2,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/2-3-los-angeles.jpg',
        preview: false,
      },
      {
        spotId: 3,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/3-0-denver.jpg',
        preview: true,
      },
      {
        spotId: 4,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/4-0-austin.jpg',
        preview: true,
      },
      {
        spotId: 5,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/5-0-seattle.jpg',
        preview: true,
      },
      {
        spotId: 6,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/6-0-island-heights.jpg',
        preview: true,
      },
      {
        spotId: 6,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/6-1-island-heights.jpg',
        preview: false,
      },
      {
        spotId: 6,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/6-2-island-heights.jpg',
        preview: false,
      },
      {
        spotId: 6,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/6-3-island-heights.jpg',
        preview: false,
      },
      {
        spotId: 6,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/6-4-island-heights.jpg',
        preview: false,
      },
      {
        spotId: 7,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/7-0-ocean-city.jpg',
        preview: true,
      },
      {
        spotId: 8,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/8-0-edwards-rd.jpg',
        preview: true,
      },
      {
        spotId: 9,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/9-0-parsippany.jpg',
        preview: true,
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: {
        [Op.in]: [
          'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/1-0-manhattan.jpg',
          'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/1-1-manhattan.jpg',
          'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/1-2-manhattan.jpg',
          'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/1-3-manhattan.jpg',
          'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/1-4-manhattan.jpg',
          'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/1-5-manhattan.jpg',
          'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/2-0-los-angeles.jpg',
          'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/2-1-los-angeles.jpg',
          'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/2-2-los-angeles.jpg',
          'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/2-3-los-angeles.jpg',
          'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/3-0-denver.jpg',
          'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/4-0-austin.jpg',
          'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/5-0-seattle.jpg',
          'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/6-0-island-heights.jpg',
          'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/6-1-island-heights.jpg',
          'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/6-2-island-heights.jpg',
          'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/6-3-island-heights.jpg',
          'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/6-4-island-heights.jpg',
          'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/7-0-ocean-city.jpg',
          'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/8-0-edwards-rd.jpg',
          'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/9-0-parsippany.jpg'
        ]
      }

    }, {});
  }
};

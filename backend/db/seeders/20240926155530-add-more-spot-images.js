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
        spotId: 8,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/8-1-edwards-rd.jpg',
        preview: false,
      },
      {
        spotId: 8,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/8-2-edwards-rd.jpg',
        preview: false,
      },
      {
        spotId: 8,
        url: 'https://raw.githubusercontent.com/djdinnebeil/spots-and-places-images/refs/heads/main/8-3-edwards-rd.jpg',
        preview: false,
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: {
        [Op.in]: [
          'https://example.com/spot8-image1.jpg',
          'https://example.com/spot8-image2.jpg',
          'https://example.com/spot8-image3.jpg',
        ]
      }
    }, {});
  }
};

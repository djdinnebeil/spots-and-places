'use strict';
const {
  Model, Validator
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spot.belongsTo(models.User, { foreignKey: 'ownerId', onDelete: 'CASCADE' });
      Spot.belongsTo(models.User, { as: 'Owner', foreignKey: 'ownerId', onDelete: 'CASCADE' });
      Spot.hasMany(models.Review, { foreignKey: 'spotId', onDelete: 'CASCADE' });
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId', onDelete: 'CASCADE' });
      Spot.hasMany(models.Booking, { foreignKey: 'spotId', onDelete: 'CASCADE' });
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
      defaultValue: null,
      validate: {
        min: -90,
        max: 90,
      }
    },
    lng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      defaultValue: null,
      validate: {
        min: -180,
        max: 180,
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};

// backend/routes/api/spots.js
const express = require('express');
const { check } = require('express-validator');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, Review, SpotImage, User, ReviewImage } = require('../../db/models');
const reviewsRouter = require('./reviews');
const bookingsRouter = require('./bookings');

const router = express.Router();

// Helper function to validate query parameters
const validateQueryParams = ({ page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice }) => {
  const errors = {};

  if (page && (isNaN(page) || page < 1)) {
    errors.page = "Page must be greater than or equal to 1";
  }
  if (size && (isNaN(size) || size < 1 || size > 20)) {
    errors.size = "Size must be greater than or equal to 1";
  }
  if (minLat && (isNaN(minLat) || minLat < -90 || minLat > 90)) {
    errors.minLat = "Minimum latitude is invalid";
  }
  if (maxLat && (isNaN(maxLat) || maxLat < -90 || maxLat > 90)) {
    errors.maxLat = "Maximum latitude is invalid";
  }
  if (minLng && (isNaN(minLng) || minLng < -180 || minLng > 180)) {
    errors.minLng = "Minimum longitude is invalid";
  }
  if (maxLng && (isNaN(maxLng) || maxLng < -180 || maxLng > 180)) {
    errors.maxLng = "Maximum longitude is invalid";
  }
  if (minPrice && (isNaN(minPrice) || minPrice < 0)) {
    errors.minPrice = "Minimum price must be greater than or equal to 0";
  }
  if (maxPrice && (isNaN(maxPrice) || maxPrice < 0)) {
    errors.maxPrice = "Maximum price must be greater than or equal to 0";
  }
  return Object.keys(errors).length ? errors : null;
};

// Helper function to format each spot
const formatSpot = (spot) => ({
  id: spot.id,
  ownerId: spot.ownerId,
  address: spot.address,
  city: spot.city,
  state: spot.state,
  country: spot.country,
  lat: parseFloat(spot.lat),
  lng: parseFloat(spot.lng),
  name: spot.name,
  description: spot.description,
  price: parseFloat(spot.price),
  createdAt: spot.createdAt,
  updatedAt: spot.updatedAt,
  avgRating: spot.getDataValue('avgRating'),
  previewImage: spot.SpotImages.length > 0 ? spot.SpotImages[0].url : null
});

// Get all spots with query filters and pagination
router.get('/', async (req, res) => {
  if (Object.keys(req.query).length === 0) {
    try {
      const spots = await Spot.findAll({
        include: [
          {
            model: Review,
            attributes: [] // For aggregation
          },
          {
            model: SpotImage,
            attributes: ['url'],
            where: {
              preview: true
            },
            required: false // Use LEFT JOIN to include spots even if no preview image exists
          }
        ],
        attributes: {
          include: [
            [
              Sequelize.fn('AVG', Sequelize.col('Reviews.stars')),
              'avgRating'
            ]
          ]
        },
        group: ['Spot.id', 'SpotImages.id']
      });

      // Format the spots to return the preview image as a separate field
      const formattedSpots = spots.map(spot => (formatSpot(spot)));
      return res.json({
        Spots: formattedSpots,
        page: 1,
        size: 20
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }
  else {
    let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;

    const validationErrors = validateQueryParams({page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice});
    if (validationErrors) {
      return res.status(400).json({
        message: "Bad Request",
        errors: validationErrors,
      });
    }

    try {
      page = parseInt(page) >= 1 ? parseInt(page) : 1;
      size = parseInt(size) >= 1 && parseInt(size) <= 20 ? parseInt(size) : 20;

      // Apply any filters
      const where = {};
      if (minLat) where.lat = {[Op.gte]: parseFloat(minLat)};
      if (maxLat) where.lat = {[Op.lte]: parseFloat(maxLat)};
      if (minLng) where.lng = {[Op.gte]: parseFloat(minLng)};
      if (maxLng) where.lng = {[Op.lte]: parseFloat(maxLng)};
      if (minPrice) where.price = {[Op.gte]: parseFloat(minPrice)};
      if (maxPrice) where.price = {[Op.lte]: parseFloat(maxPrice)};

      // Retrieve the spots with filters and pagination
      const spots = await Spot.findAll({
        where,
        limit: size,
        offset: (page - 1) * size,
        include: [
          {
            model: SpotImage,
            attributes: ['url'],
            where: {preview: true},
            required: false,
          }
        ],
        attributes: [
          'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt'
        ]
      });

      const formattedSpots = [];

      for (let spot of spots) {
        // Calculate avg rating for each spot
        const avgRating = await Review.findOne({
          where: {spotId: spot.id},
          attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']]
        });

        formattedSpots.push(formatSpot(spot));
      }
      return res.json({
        Spots: formattedSpots,
        page,
        size,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({message: 'Something went wrong'});
    }
  }
});

// Get all spots owned by the current user
router.get('/current', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch spots with average rating and preview image
    const spots = await Spot.findAll({
      where: { ownerId: userId },
      include: [
        {
          model: Review,
          attributes: [] // Join for calculating the average rating
        },
        {
          model: SpotImage,
          attributes: ['url'],
          where: { preview: true } // Get only the preview image
        }
      ],
      attributes: {
        include: [
          // Calculate the average star rating for each spot
          [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']
        ]
      },
      group: ['Spot.id', 'SpotImages.id']
    });

    // If the user has no spots, return an empty array
    if (spots.length === 0) {
      return res.json({ Spots: [] });
    }

    // Format spots for the response
    const formattedSpots = spots.map(spot => ({
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      avgRating: spot.getDataValue('avgRating'),
      previewImage: spot.SpotImages.length > 0 ? spot.SpotImages[0].url : null
    }));

    return res.json({ Spots: formattedSpots });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get details of a spot by id
router.get('/:spotId', async (req, res) => {

  const { spotId } = req.params;

  try {
    // Find the spot by id, including its related data
    const spot = await Spot.findByPk(spotId, {
      include: [
        {
          model: SpotImage, // Include associated images
          attributes: ['id', 'url', 'preview']
        },
        {
          model: Review,
          attributes: ['id', 'review', 'stars', 'createdAt', 'updatedAt'],
          include: [
            {
              model: User,
              attributes: ['firstName', 'lastName']
            }
          ]
        },
        {
          model: User, // Include spot owner details
          as: 'Owner',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    // Return 404 if the spot is not found
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      });
    }


    // Aggregate the total number of reviews and average star rating
    const reviews = await Review.findAll({
      where: {spotId},
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'numReviews'],
        [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgStarRating']
      ]
    });

    // Extract the aggregated review data
    const {numReviews, avgStarRating} = reviews[0].dataValues;

    // Format the spot data for the response
    const formattedSpot = {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: parseFloat(spot.lat),
      lng: parseFloat(spot.lng),
      name: spot.name,
      description: spot.description,
      price: parseFloat(spot.price),
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      numReviews: numReviews || 0,
      avgStarRating: avgStarRating ? parseFloat(avgStarRating).toFixed(1) : null,
      SpotImages: spot.SpotImages,
      Owner: spot.Owner,
      Reviews: spot.Reviews
    };

    return res.json(formattedSpot);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

// Validation middleware for creating a spot
const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .optional({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude is not valid'),
  check('lng')
    .optional({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude is not valid'),
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required')  // First case: missing name
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),  // Second case: name exceeds 50 characters
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .isFloat({ gt: 0 })
    .withMessage('Price per day is required'),
  handleValidationErrors
];

// Create a Spot
router.post('/', requireAuth, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const ownerId = req.user.id;

  try {
    const newSpot = await Spot.create({
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });

    return res.status(201).json({
      id: newSpot.id,
      ownerId: newSpot.ownerId,
      address: newSpot.address,
      city: newSpot.city,
      state: newSpot.state,
      country: newSpot.country,
      lat: newSpot.lat,
      lng: newSpot.lng,
      name: newSpot.name,
      description: newSpot.description,
      price: newSpot.price,
      createdAt: newSpot.createdAt,
      updatedAt: newSpot.updatedAt
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

// Validation middleware for adding an image
const validateImage = [
  check('url')
    .exists({ checkFalsy: true })
    .isURL()
    .withMessage('A valid URL is required'),
  check('preview')
    .exists({ checkFalsy: false })
    .isBoolean()
    .withMessage('Preview must be a boolean value'),
  handleValidationErrors
];

// Add an Image to a spot by spotId
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const userId = req.user.id;

  try {
    const spot = await Spot.findByPk(spotId);

    // Check if the spot exists
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      });
    }

    // Ensure the spot belongs to the current user
    if (spot.ownerId !== userId) {
      return res.status(403).json({
        message: 'Forbidden'
      });
    }

    // Proceed to input validation if the user is authorized
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}, validateImage, async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;

  try {
    // Create a new image associated with the spot
    const newImage = await SpotImage.create({
      spotId,
      url,
      preview
    });

    // Respond with the newly created image data
    return res.status(201).json({
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

// Update a spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
  const { spotId } = req.params;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const { previewImage, photo1, photo2, photo3, photo4 } = req.body;

  const userId = req.user.id;

  try {
    const spot = await Spot.findByPk(spotId);

    // Check if the spot exists
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Ensure the spot belongs to the current user
    if (spot.ownerId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await spot.update({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });

    // Delete all existing images for the spot
    await SpotImage.destroy({ where: { spotId } });

    // Add the new preview image
    if (previewImage) {
      await SpotImage.create({ spotId, url: previewImage, preview: true });
    }

    // Add additional images, if provided
    const photos = [photo1, photo2, photo3, photo4].filter(Boolean);
    for (const photo of photos) {
      await SpotImage.create({ spotId, url: photo, preview: false });
    }

    return res.json(spot);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

// Delete a spot
router.delete('/:spotId', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const userId = req.user.id;

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await spot.destroy();

    return res.status(200).json({ message: 'Successfully deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

router.use('/:spotId', reviewsRouter);
router.use('/:spotId', bookingsRouter);

module.exports = router;

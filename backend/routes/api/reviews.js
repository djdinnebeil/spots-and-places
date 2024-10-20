// backend/routes/api/reviews.js
const express = require('express');

const { Review, Spot, User, ReviewImage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router({ mergeParams: true });

router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    const reviews = await Review.findAll({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Spot,
          attributes: [
            'id', 'ownerId', 'address', 'city', 'state', 'country',
            'lat', 'lng', 'name', 'price'
          ],
          include: [
            {
              model: SpotImage,
              attributes: ['url'],
              where: { preview: true },
              required: false // Use LEFT JOIN so that even if no preview exists, it includes the spot
            }
          ]
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    });

    const formattedReviews = reviews.map(review => ({
      id: review.id,
      userId: review.userId,
      spotId: review.spotId,
      review: review.review,
      stars: review.stars,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      User: {
        id: review.User.id,
        firstName: review.User.firstName,
        lastName: review.User.lastName
      },
      Spot: {
        id: review.Spot.id,
        ownerId: review.Spot.ownerId,
        address: review.Spot.address,
        city: review.Spot.city,
        state: review.Spot.state,
        country: review.Spot.country,
        lat: parseFloat(review.Spot.lat),
        lng: parseFloat(review.Spot.lng),
        name: review.Spot.name,
        price: parseFloat(review.Spot.price),
        previewImage: review.Spot.SpotImages.length > 0 ? review.Spot.SpotImages[0].url : null
      },
      ReviewImages: review.ReviewImages
    }));

    return res.json({ Reviews: formattedReviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get all reviews for a spot
router.get('/reviews', async (req, res) => {
  const { spotId } = req.params;
  try {
    // Check if the spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Retrieve all reviews for the spot
    const reviews = await Review.findAll({
      where: { spotId },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    });

    const formattedReviews = reviews.map(review => ({
      id: review.id,
      userId: review.userId,
      spotId: review.spotId,
      review: review.review,
      stars: review.stars,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      User: {
        id: review.User.id,
        firstName: review.User.firstName,
        lastName: review.User.lastName
      },
      ReviewImages: review.ReviewImages.map(image => ({
        id: image.id,
        url: image.url
      }))
    }));

    return res.json({ Reviews: formattedReviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

// Validation middleware for reviews
const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

// Create a review for a spot
router.post('/reviews', requireAuth, validateReview, async (req, res) => {
  const { spotId } = req.params;
  const { review, stars } = req.body;
  const userId = req.user.id;

  try {
    // Check if the spot exists
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Check if the user has already submitted a review for the spot
    const existingReview = await Review.findOne({
      where: {
        userId,
        spotId,
      },
    });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this spot' });
    }

    // Create the new review
    const newReview = await Review.create({
      userId,
      spotId,
      review,
      stars,
    });

    const reviewData = newReview.toJSON();

    // Manually reorder the properties with createdAt before updatedAt
    const formattedReview = {
      id: reviewData.id,
      userId: reviewData.userId,
      spotId: reviewData.spotId,
      review: reviewData.review,
      stars: reviewData.stars,
      createdAt: reviewData.createdAt,
      updatedAt: reviewData.updatedAt,
    };

    return res.status(201).json(formattedReview);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

// Add an image to a review
router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const { url } = req.body;
  const userId = req.user.id;

  try {
    // Check if the review exists
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    // Ensure the review belongs to the current user
    if (review.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Check if the review already has 10 images
    const imageCount = await ReviewImage.count({
      where: { reviewId },
    });
    if (imageCount >= 10) {
      return res.status(403).json({ message: "Maximum number of images for this resource was reached" });
    }

    // Create the new image for the review
    const newImage = await ReviewImage.create({
      reviewId,
      url,
    });

    return res.status(201).json({
      id: newImage.id,
      url: newImage.url,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

// Edit a review
router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
  const { reviewId } = req.params;
  const { review, stars } = req.body;
  const userId = req.user.id;
  try {
    // Check if the review exists
    const existingReview = await Review.findByPk(reviewId);
    if (!existingReview) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    // Ensure the review belongs to the current user
    if (existingReview.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Update the review with new values
    await existingReview.update({
      review,
      stars,
    });

    return res.status(200).json(existingReview);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

// Delete a review
router.delete('/:reviewId', requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;

  try {
    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (review.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await review.destroy();

    return res.status(200).json({ message: 'Successfully deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;

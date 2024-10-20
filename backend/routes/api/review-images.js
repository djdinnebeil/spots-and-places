// backend/routes/api/review-images.js
const express = require('express');
const { ReviewImage, Review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// Delete a review image
router.delete('/:imageId', requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const userId = req.user.id;

  try {
    const reviewImage = await ReviewImage.findByPk(imageId);

    if (!reviewImage) {
      return res.status(404).json({ message: "Review Image couldn't be found" });
    }

    const review = await Review.findByPk(reviewImage.reviewId);

    if (review.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await reviewImage.destroy();
    return res.status(200).json({ message: 'Successfully deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;

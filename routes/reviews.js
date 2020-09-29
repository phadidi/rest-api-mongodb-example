const express = require('express');
const {
  getReviews,
  getReviewById,
  addReview,
  updateReviewById,
  deleteReviewById,
} = require('../controllers/reviews');

const Review = require('../models/review');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getReviews
  )
  .post(protect, authorize('user', 'admin'), addReview);

router
  .route('/:id')
  .get(getReviewById)
  .put(protect, authorize('user', 'admin'), updateReviewById)
  .delete(protect, authorize('user', 'admin'), deleteReviewById);

module.exports = router;

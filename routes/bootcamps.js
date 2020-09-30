const express = require('express');
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');
const router = express.Router();
const {
  getBootcamps,
  getBootcampById,
  addBootcamp,
  updateBootcampById,
  removeBootcampById,
  getBootcampsInRadius,
  updloadBootcampPhoto,
} = require('../controllers/bootcamps');
const Bootcamp = require('../models/bootcamp');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), updloadBootcampPhoto);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), addBootcamp);

router
  .route('/:id')
  .get(getBootcampById)
  .put(protect, authorize('publisher', 'admin'), updateBootcampById)
  .delete(protect, authorize('publisher', 'admin'), removeBootcampById);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

module.exports = router;

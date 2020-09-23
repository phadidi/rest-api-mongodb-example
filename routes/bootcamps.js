const express = require('express');
const courseRouter = require('./courses');
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

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(addBootcamp);
router
  .route('/:id')
  .get(getBootcampById)
  .put(updateBootcampById)
  .delete(removeBootcampById);

router.use('/:bootcampId/courses', courseRouter);
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/radius/:zipcode/:distance/:unit').get(getBootcampsInRadius);
router.route('/:id/photo').put(updloadBootcampPhoto);

module.exports = router;

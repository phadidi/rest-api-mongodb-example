const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getCourses,
  getCourseById,
  addCourse,
  updateCourseById,
  removeCourseById,
} = require('../controllers/courses');
const Course = require('../models/course');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Course, { path: 'bootcamp', select: 'name description' }),
    getCourses
  )
  .post(protect, authorize('publisher', 'admin'), addCourse);
router
  .route('/:id')
  .get(getCourseById)
  .put(protect, authorize('publisher', 'admin'), updateCourseById)
  .delete(protect, authorize('publisher', 'admin'), removeCourseById);

module.exports = router;

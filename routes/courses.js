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

router
  .route('/')
  .get(
    advancedResults(Course, { path: 'bootcamp', select: 'name description' }),
    getCourses
  )
  .post(addCourse);
router
  .route('/:id')
  .get(getCourseById)
  .put(updateCourseById)
  .delete(removeCourseById);

module.exports = router;

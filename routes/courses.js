const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getCourses,
  getCourseById,
  addCourse,
  updateCourseById,
  removeCourseById,
} = require('../controllers/courses');

router.route('/').get(getCourses).post(addCourse);
router
  .route('/:id')
  .get(getCourseById)
  .put(updateCourseById)
  .delete(removeCourseById);

module.exports = router;

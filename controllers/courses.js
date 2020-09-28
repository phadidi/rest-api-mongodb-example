const ErrorResponse = require('../utils/errorResponse');
const asyncMiddleware = require('../middleware/async');
const Course = require('../models/course');
const Bootcamp = require('../models/bootcamp');

// @desc    Get Courses (V1)
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncMiddleware(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get Courses (V1)
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourseById = asyncMiddleware(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });
  if (!course)
    return next(
      new ErrorResponse(`No course found for id ${req.params.id}`, 404)
    );
  res.status(200).json({ success: true, data: course });
});

// @desc    Add a Course (V1)
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.addCourse = asyncMiddleware(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp)
    return next(
      new ErrorResponse(
        `No bootcamp found for id ${req.params.bootcampId}`,
        404
      )
    );
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin')
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
        401
      )
    );
  const course = await Course.create(req.body);
  res.status(201).json({ success: true, data: course });
});

// @desc    Update a Course by ID (V1)
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourseById = asyncMiddleware(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`No course found for id ${req.params.id}`, 404)
    );
  } else if (
    course.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User "${req.user.id}" is not authorized to update course "${course._id}"`,
        401
      )
    );
  } else {
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    course.save();
    res.status(200).json({ success: true, data: course });
  }
});

// @desc    Remove a Course by ID (V1)
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.removeCourseById = asyncMiddleware(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`No course found for id ${req.params.id}`, 404)
    );
  } else if (
    course.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete course ${course._id}`,
        401
      )
    );
  } else {
    await course.remove();
    res.status(200).json({ success: true, data: course });
  }
});

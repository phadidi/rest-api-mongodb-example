const ErrorResponse = require('../utils/errorResponse');
const asyncMiddleware = require('../middleware/async');
const Course = require('../models/course');
const Bootcamp = require('../models/bootcamp');

// @desc    Get Courses (V1)
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncMiddleware(async (req, res, next) => {
  let query;
  if (req.params.bootcampId)
    query = Course.find({ bootcamp: req.params.bootcampId }).populate({
      path: 'bootcamp',
      select: 'name description',
    });
  else
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  const courses = await query;
  res.status(200).json({ success: true, count: courses.length, data: courses });
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
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp)
    return next(
      new ErrorResponse(
        `No bootcamp found for id ${req.params.bootcampId}`,
        404
      )
    );
  req.body.bootcamp = req.params.bootcampId;
  const course = await Course.create(req.body);
  res.status(201).json({ success: true, data: course });
});

// @desc    Update a Course by ID (V1)
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourseById = asyncMiddleware(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!course) {
    return next(
      new ErrorResponse(`No course found for id ${req.params.id}`, 404)
    );
  } else res.status(200).json({ success: true, data: course });
});

// @desc    Remove a Course by ID (V1)
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.removeCourseById = asyncMiddleware(async (req, res, next) => {
  const course = await Course.findByIdAndRemove(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`No course found for id ${req.params.id}`, 404)
    );
  } else res.status(200).json({ success: true, data: course });
});

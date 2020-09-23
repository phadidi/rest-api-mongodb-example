const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncMiddleware = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/bootcamp');

// @desc    Get Bootcamps (V1)
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncMiddleware(async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };
  const specialParams = ['select', 'sort', 'page', 'limit'];
  specialParams.forEach((param) => delete reqQuery[param]);
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort('fields');
  } else query = query.sort('-createdAt');
  const page = parseInt(req.query.page, 10) || 1; // default at first page
  const limit = parseInt(req.query.limit, 10) || 25; // default at 100 per page
  const start = (page - 1) * limit;
  const end = page * limit;
  const total = await Bootcamp.countDocuments();
  query = query.skip(start).limit(limit);
  const bootcamps = await query;
  const pagination = {};
  if (end < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (start > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.status(200).json({
    success: true,
    pagination,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc    Get a Bootcamp by ID (V1)
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcampById = asyncMiddleware(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp)
    return next(
      new ErrorResponse(`No bootcamp found for id ${req.params.id}`, 404)
    );
  else res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Add a Bootcamp (V1)
// @route   POST /api/v1/bootcamps
// @access  Private
exports.addBootcamp = asyncMiddleware(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc    Update a Bootcamp by ID (V1)
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcampById = asyncMiddleware(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp found for id ${req.params.id}`, 404)
    );
  } else res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Remove a Bootcamp by ID (V1)
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.removeBootcampById = asyncMiddleware(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndRemove(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp found for id ${req.params.id}`, 404)
    );
  } else res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Get Bootcamps within a given radius (V1)
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance(/:unit?)
// @access  Private
exports.getBootcampsInRadius = asyncMiddleware(async (req, res, next) => {
  const { zipcode, distance, unit } = req.params;
  const location = await geocoder.geocode(zipcode);
  const lat = location[0].latitude;
  const long = location[0].longitude;
  var dividend;
  if (unit && unit === 'km') dividend = 6378;
  else dividend = 3963;
  const radius = distance / dividend; // 3963 for miles (default), 6378 for kilometers
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[long, lat], radius] } },
  });
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc    Upload a Bootcamp photo (V1)
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.updloadBootcampPhoto = asyncMiddleware(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp found for id ${req.params.id}`, 404)
    );
  }

  // Make sure user is bootcamp owner --> TODO: include this with user model
  // if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.user.id} is not authorized to update this bootcamp`,
  //       401
  //     )
  //   );
  // }

  if (!req.files) {
    return next(new ErrorResponse(`Please include a valid image file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please include a valid image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Filesize cannot exceed ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Error occured during file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

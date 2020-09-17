const Bootcamp = require('../models/bootcamp');

// @desc    Get Bootcamps (V1)
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (e) {
    res.status(400).json({ success: false, data: e });
  }
};

// @desc    Get a Bootcamp by ID (V1)
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcampById = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById();
    if (!bootcamp) {
      res.status(404).json({
        success: false,
        msg: `No bootcamp found for id ${req.params.id}`,
      });
    } else res.status(200).json({ success: true, data: bootcamps });
  } catch (e) {
    res.status(400).json({ success: false, data: e });
  }
};

// @desc    Add a Bootcamp (V1)
// @route   POST /api/v1/bootcamps
// @access  Private
exports.addBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
  } catch (e) {
    res.status(400).json({ success: false, data: e });
  }
};

// @desc    Update a Bootcamp by ID (V1)
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcampById = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      res.status(404).json({
        success: false,
        msg: `No bootcamp found for id ${req.params.id}`,
      });
    } else res.status(200).json({ success: true, data: bootcamp });
  } catch (e) {
    res.status(400).json({ success: false, data: e });
  }
};

// @desc    Remove a Bootcamp by ID (V1)
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.removeBootcampById = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndRemove(req.params.id);
    if (!bootcamp) {
      res.status(404).json({
        success: false,
        msg: `No bootcamp found for id ${req.params.id}`,
      });
    } else res.status(200).json({ success: true, data: bootcamp });
  } catch (e) {
    res.status(400).json({ success: false, data: e });
  }
};

const colors = require('colors');
// @desc    Logs each request to the console
module.exports = function (req, res, next) {
  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
      .yellow.italic
  );
  next();
};

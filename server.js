const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');

dotenv.config({ path: './config/config.env' });
require('./config/db')();
const app = express();
app.use(express.json());
app.use(require('cookie-parser'));

const ENV = process.env.NODE_ENV || 'default';
if (ENV === 'development') {
  app.use(morgan('dev'));
} else app.use(require('./middleware/logger'));
app.use(require('express-fileupload'));
app.use(require('express-mongo-sanitize'));
app.use(require('helmet'));
app.use(require('xss-clean'));
app.use(require('express-rate-limit')({ windowMs: 10 * 60 * 1000, max: 100 })); // 10 minute limit
app.use(require('hpp'));
app.use(require('cors'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/bootcamps', require('./routes/bootcamps'));
app.use('/api/v1/courses', require('./routes/courses'));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/reviews', require('./routes/courses'));
app.use(require('./middleware/error'));
const PORT = process.env.PORT || 3000;

const server = app.listen(
  PORT,
  console.log(
    `Server listening on port ${PORT} in ${ENV} environment`.green.bold
  )
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`${err.message}`.red);
  server.close(() => process.exit(1));
});

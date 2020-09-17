const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');

dotenv.config({ path: './config/config.env' });
require('./config/db')();
const app = express();
app.use(express.json());

const ENV = process.env.NODE_ENV || 'default';
if (ENV === 'development') {
  app.use(morgan('dev'));
} else app.use(require('./middleware/logger'));

app.use('/api/v1/bootcamps', require('./routes/bootcamps'));
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

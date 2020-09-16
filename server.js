const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });
const app = express();

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'default';
app.listen(
  PORT,
  console.log(`Server listening on port ${PORT} in ${ENV} environment`)
);

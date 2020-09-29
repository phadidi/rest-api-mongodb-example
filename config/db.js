const mongoose = require('mongoose');
const colors = require('colors');
module.exports = async () => {
  const db = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log(`Connected to MongoDB ${db.connection.host}`.green.bold);
};

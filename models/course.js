const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please include a title'],
  },
  description: {
    type: String,
    required: [true, 'Please include a description'],
  },
  weeks: {
    type: String,
    required: [true, 'Please include a duration of weeks'],
  },
  tuition: { type: Number, required: [true, 'Please include a tuition'] },
  minimumSkill: {
    type: String,
    required: [true, 'Please include a valid minimum skill level'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarshipsAvailable: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  bootcamp: { type: mongoose.Schema.ObjectId, ref: 'Bootcamp', required: true },
});

CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    { $match: { bootcamp: bootcampId } },
    { $group: { _id: '$bootcamp', averageCost: { $avg: '$tuition' } } },
  ]);
  try {
    if (obj[0]) {
      await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
        averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
      });
    } else {
      await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
        averageCost: undefined,
      });
    }
  } catch (e) {
    console.error(e);
  }
};

CourseSchema.post('save', async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

CourseSchema.post('remove', async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);

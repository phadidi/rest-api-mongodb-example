const express = require('express');
const router = express.Router();
const {
  getBootcamps,
  getBootcampById,
  addBootcamp,
  updateBootcampById,
  removeBootcampById,
} = require('../controllers/bootcamps');

router.route('/').get(getBootcamps).post(addBootcamp);
router
  .route('/:id')
  .get(getBootcampById)
  .put(updateBootcampById)
  .delete(removeBootcampById);

module.exports = router;

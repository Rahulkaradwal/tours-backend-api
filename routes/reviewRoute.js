const express = require('express');
const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');

const router = express.Router({ mergeParams: true });

router.route('/').get(reviewController.getallReview);

router.route('/:id').get(authController.protect, reviewController.getallReview);
router
  .route('/:id')
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;

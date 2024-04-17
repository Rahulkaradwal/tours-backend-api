const express = require('express');
const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getallReview)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourIds,
    reviewController.createReview
  );

router.route('/:id').get(authController.protect, reviewController.getallReview);
router
  .route('/:id')
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview)
  .get(authController.protect, reviewController.getReview);

module.exports = router;

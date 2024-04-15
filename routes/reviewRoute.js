const express = require('express');
const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, reviewController.getallReview)
  .post(authController.protect, reviewController.createReview);

router.route('/:id').get(authController.protect, reviewController.getallReview);

module.exports = router;

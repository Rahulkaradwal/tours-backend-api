const express = require('express');

const tourController = require('./../controller/tourController');
const authController = require('./../controller/authController');
const reviewController = require('./../controller/reviewController');

const router = express.Router();

router
  .route('/top-5-cheap')
  .get(
    authController.protect,
    tourController.aliasTopTour,
    tourController.getAllTours
  );
// router
//   .route('/monthly-plan')
//   .get(tourController.getMonthly, tourController.getAllTours);

router
  .route('/tour-stats')
  .get(
    authController.protect,
    tourController.getTourStats,
    tourController.getAllTours
  );

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(
    authController.protect,
    tourController.CheckBody,
    tourController.createTour
  );

router
  .route('/:id')
  .get(authController.protect, tourController.getTour)
  .patch(authController.protect, tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

// nested routes for review

// post - /tour/23fd/reviews
// get  - /tour/34rfd/reviews/:id
// getall - /tour/dcjkm3r/reviews

router
  .route('/:tourId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;

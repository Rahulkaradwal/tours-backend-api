const express = require('express');

const tourController = require('./../controller/tourController');
const authController = require('./../controller/authController');
const reviewRoute = require('./reviewRoute');

const router = express.Router();

router.use('/:tourId/reviews', reviewRoute);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTour, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'leaed-guide'),
    tourController.createTour
  );

// auth Controller
router.use(authController.protect);

router
  .route('/tour-stats')
  .get(tourController.getTourStats, tourController.getAllTours);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;

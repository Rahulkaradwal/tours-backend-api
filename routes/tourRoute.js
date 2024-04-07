const express = require('express');

const tourController = require('./../controller/tourController');

const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTour, tourController.getAllTours);
// router
//   .route('/monthly-plan')
//   .get(tourController.getMonthly, tourController.getAllTours);

router
  .route('/tour-stats')
  .get(tourController.getTourStats, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.CheckBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;

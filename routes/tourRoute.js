const express = require('express');

const tourController = require('./../controller/tourController');

const router = express.Router();

router.param('id', tourController.CheckID);

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

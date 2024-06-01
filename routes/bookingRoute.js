const express = require('express');
const bookingController = require('./../controller/bookingController');
const authController = require('./../controller/authController');

const router = express.Router();

router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckoutSession
);
router.get('/my-tours', authController.protect, bookingController.getMyTours);

router.get(
  '/sessionTest/:tourId',
  authController.protect,
  bookingController.sessionTest
);

module.exports = router;

const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const factory = require('./../controller/handleFactory');

exports.getallReview = factory.getAll(Review);

exports.getReview = factory.getOne(Review, { path: 'guides' });

// exports.createReview = catchAsync(async (req, res, next) => {
//   console.log('in the create review');
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;
//   console.log(req.body);
//   const newReview = await Review.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       review: newReview,
//     },
//   });
// });

exports.setTourIds = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
});

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

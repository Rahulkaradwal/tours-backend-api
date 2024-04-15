const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const ApiFeatures = require('./../utils/apiFeatures');

exports.getallReview = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Review.find(), req.query)
    .filter()
    .sort()
    .limiting()
    .paginate();
  const reviews = await features.query;
  res.status(200).json({
    totalResult: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = Review.findById(req.params.id);
  if (!review) {
    return next(new AppError('Not found', 401));
  }
  res.status(200).json({
    data: {
      review,
    },
  });
});

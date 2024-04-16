const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');

exports.deleteOne = (model) => {
  catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndDelete(req.params.id);
    if (!doc) {
      next(new AppError('Could not find the Data', 404));
    }
    res.status(200).json({
      status: 'success',
      data: null,
    });
  });
};

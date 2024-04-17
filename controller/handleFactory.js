const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');
const ApiFeatures = require('./../utils/apiFeatures');

exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      next(new AppError('Could not find the Data', 404));
    }
    res.status(200).json({
      status: 'success',
      data: null,
    });
  });
};

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runvalidators: true,
    });
    if (!doc) {
      next(new AppError('No docuement found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    if (!doc) {
      next(new AppError('Could not crete the Document', 401));
    }
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      data: { doc },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limiting()
      .paginate();
    const doc = await features.query;
    // send result
    res.status(200).json({
      totalResults: doc.length,
      data: { doc },
    });
  });

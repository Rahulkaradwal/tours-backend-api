const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/AppError');
const factory = require('./../controller/handleFactory');

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);
// only for admins
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

// filter function for updateMe
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('You can not update password with this', 401));
  }

  const filterBody = filterObj(req.body, 'name', 'email');

  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

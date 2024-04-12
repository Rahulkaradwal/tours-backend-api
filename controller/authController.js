const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const signToken = require('./../utils/signToken');
const AppError = require('./../utils/AppError');

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const token = signToken(newUser._id.toString());

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email);
  if (!email || !password) {
    return next(
      new AppError('Please provide the valid email and password', 400)
    );
  }

  const user = await User.findOne({ email }).select('+password');
  const lest = await user.correctPassword(password, user.password);
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Password Is Incorrect', 401));
  }

  const token = signToken(user._id.toString());
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
});

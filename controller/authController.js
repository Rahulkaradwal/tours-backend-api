const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const signToken = require('./../utils/signToken');
const AppError = require('./../utils/AppError');
const { promisify } = require('util');

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

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('You are not Authroized, Pleaase try again', 401));
  }
  // Verify Token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check user still exists
  const freshUser = await User.findById(decode.id);
  if (!freshUser) {
    return next(
      new AppError('The User belonging to this Token does not exists', 401)
    );
  }

  if (freshUser.changePasswordAfter(decode.iat)) {
    return next(
      new AppError(
        'User recently changed the password, please login again',
        401
      )
    );
  }

  // grant access to the user
  req.user = freshUser;
  next();
});

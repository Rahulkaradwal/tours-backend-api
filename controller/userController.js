const User = require('./../models/userModel');

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

// create user

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

exports.getAllUsers = (req, res) => {
  res.status(200).json({
    totalResults: users.length,
    data: { users },
  });
};

exports.getUser = (req, res) => {
  const id = req.params.id * 1; // to convert string into number we mulitplied by number

  const user = users.find((el) => el.id === id);
  if (!user) {
    res.status(404).json({
      status: 'Fail',
      message: 'Invlid ID',
    });
  }
  res.status(200).json({
    data: { user },
  });
};

exports.updateUser = (req, res) => {
  if (req.params.id * 1 > users.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    data: { user },
  });
};

exports.deleteUser = (req, res) => {
  if (req.params.id * 1 > users.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
};

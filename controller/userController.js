const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/AppError');

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

exports.createUser = (req, res) => {
  const newId = users[users.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  users.push(newTour);

  fs.writeFile('users-simple.json', JSON.stringify(users), (err) => {
    res.status(200).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
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

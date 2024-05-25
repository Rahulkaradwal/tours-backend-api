const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/AppError');
const factory = require('./../controller/handleFactory');
const multer = require('multer');
const sharp = require('sharp');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

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

const multerStorage = multer.memoryStorage();

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_BUCKET_REGION,
});

const multerFilter = (req, file, cb) => {
  // Corrected signature here
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');

exports.uploadPhotoToS3 = async (req, res, next) => {
  if (!req.file) return next();

  const filename = `${req.body.name}-${Date.now()}-${req.file.originalname}`;

  try {
    const uploadParams = {
      Bucket: 'tour-users',
      Key: `user-photos/${filename}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const data = await s3.upload(uploadParams).promise();

    req.file.filename = filename;
    req.file.location = data.Location;

    next();
  } catch (err) {
    console.error('Error uploading image:', err);
    return next(new AppError('Error uploading image', 500));
  }
};

// exports.resizeUserPhoto = async (req, res, next) => {
//   if (!req.file) return next();

//   const filename = `${req.body.name}-${Date.now()}.jpeg`;

//   try {
//     const passThrough = new PassThrough();

//     sharp(req.file.buffer)
//       .resize(500, 500)
//       .toFormat('jpeg')
//       .jpeg({ quality: 50 })
//       .pipe(passThrough);

//     const uploadParams = {
//       Bucket: 'tour-users',
//       Key: `user-photos/${filename}`,
//       Body: buffer,
//       ContentType: 'image/jpeg',
//     };

//     const data = await s3.upload(uploadParams).promise();

//     req.file.filename = filename;
//     req.file.location = data.Location;

//     next();
//   } catch (err) {
//     console.error('Error processing image:', err); // Detailed error logging

//     return next(new AppError('Error processing image', 500));
//   }
// };

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('You can not update password with this', 401));
  }

  const filterBody = filterObj(req.body, 'name', 'email');
  if (req.file) filterBody.photo = req.file.location;

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

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

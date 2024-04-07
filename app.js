const express = require('express');
const app = express();
const morgan = require('morgan');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');

app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);

app.use('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find the requested url ${req.originalUrl}, please try with correct url`,
  // });
  // next();

  const err = new Error(
    `Can't find the requested url ${req.originalUrl}, please try with correct url`
  );
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});

// global error handler middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;

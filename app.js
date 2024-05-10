const express = require('express');
const app = express();
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 100,
  message: 'Too many requests from this IP, please try again after 1 hour',
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors());

app.use(helmet());
app.use(express.json());

app.use(mongoSanitize());
app.use(xss());

app.use(express.static(`${__dirname}/public`));

const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');
const reviewRoute = require('./routes/reviewRoute');

app.use('/api', limiter);
app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);
app.use('/api/reviews', reviewRoute);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Can't find the requested url ${req.originalUrl}, please try with correct url`,
      404
    )
  );
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

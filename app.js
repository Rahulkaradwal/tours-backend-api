const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const AppError = require('./utils/AppError');

const app = express();
// Trust the proxy to get the correct client IP
app.set('trust proxy', true);

// CORS should be set up right after initializing express
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://tour-manager-chi.vercel.app'],
    optionsSuccessStatus: 200,
  })
);
// app.use(cors());
// Other middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 100,
  message: 'Too many requests from this IP, please try again after an hour',
});
app.use('/api', limiter);

// Static files
app.use(express.static(`${__dirname}/public`));

// Routes
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');
const reviewRoute = require('./routes/reviewRoute');

app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);
app.use('/api/reviews', reviewRoute);

// Handling unmatched routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;

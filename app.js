const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const AppError = require('./utils/AppError');
const path = require('path');
const bookingController = require('./controller/bookingController');
const bodyParser = require('body-parser');

const app = express();
// Trust the proxy to get the correct client IP
// app.set('trust proxy', 1);

// CORS configuration to allow all origins and credentials
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true); // Allow all origins
  },
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions)); // Enable pre-flight across-the-board

app.use('/webhook-checkout', bodyParser.raw({ type: '*/*' }));

app.post(
  '/webhook-checkout',
  // bodyParser.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

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
const bookingRoute = require('./routes/bookingRoute');

app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);
app.use('/api/reviews', reviewRoute);
app.use('/api/booking', bookingRoute);

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

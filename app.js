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

module.exports = app;

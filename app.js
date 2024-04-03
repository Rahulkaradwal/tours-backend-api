const express = require('express');
const app = express();

app.use(express.json());

const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');

app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);

module.exports = app;

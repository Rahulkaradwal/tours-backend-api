const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
// const Tour = require('./models/tourModel');
const User = require('./models/userModel');
// const Review = require('./models/reviewModel');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB Connected');
  })
  .catch((err) => console.error('DB connection error:', err));

const user = JSON.parse(fs.readFileSync(`${__dirname}/user.json`, 'utf-8'));

const importData = async () => {
  try {
    await User.create(user, { validateBeforeSave: false });
    console.log('Data loaded');
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log('Data deleted');
  } catch (err) {
    console.log(err);
  }
};

// importData();
// deleteData();

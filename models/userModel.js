const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },

  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please privode a valid email'],
  },
  photo: { type: String },
  password: {
    type: String,
    required: [true, 'Pleaes enter your Password'],
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Pleaes enter correct Password'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

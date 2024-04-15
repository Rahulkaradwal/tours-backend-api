const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'A review must be there'],
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, 'A tour must have a rating'],
  },
  cratedAt: Date,
  tour: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
    },
  ],
  user: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

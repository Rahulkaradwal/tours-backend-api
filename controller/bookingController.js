const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const factory = require('../controller/handleFactory');
const Tour = require('../models/tourModel');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const frontEndURL = 'https://tour-ruby.vercel.app/';

const STRIPE_WEBHOOK_SECRET = 'whsec_rm9FyQ3LaZRkFBjdUogxOCMyLTMQajPt';
// const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeSecretKey =
  'sk_test_51PKq5AACtXlX27RCDKj6vtTLUQHz7CrGNA7LzJlKM9o67eLgQSOuqMLTSwW7mMBqr2NIgeqqkJRz5JKy0klzQOqD00otacr7Ul';
const stripe = require('stripe')(stripeSecretKey);

exports.sessionTest = catchAsync(async (req, res, next) => {
  res.json({
    mailUsername: process.env.EMAIL_USERNAME,
    stripeSecretKey,
    message: 'Stripe object initialized successfully',
  });
});

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.tourId);
    if (!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${frontEndURL}`,
      cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
      customer_email: req.user.email,
      client_reference_id: req.params.tourId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${tour.name} Tour`,
              description: tour.summary,
              // images: ['URL of the tour image if available'],
            },
            unit_amount: tour.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
    });

    res.status(200).json({
      status: 'success',
      session,
    });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return next(
      new AppError('There was an error creating the checkout session.', 500)
    );
  }
});

exports.createBookingCheckout = async (session) => {
  try {
    const tour = session.client_reference_id;
    const user = (await User.findOne({ email: session.customer_email })).id;
    const price = session.amount_total / 100;

    await Booking.create({ tour, user, price });
  } catch (err) {
    console.error('Error creating booking:', err);
  }
};

exports.webhookCheckout = catchAsync(async (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    await exports.createBookingCheckout(event.data.object);
  }

  res.status(200).json({ received: true });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  // all the bookings
  const bookings = await Booking.find({ user: req.user.id });

  // find tours with return ids
  const tourId = bookings.map((val) => val.tour);
  const tours = await Tour.find({ _id: { $in: tourId } });

  res.status(200).json({
    status: 'success',
    data: tours,
  });
});

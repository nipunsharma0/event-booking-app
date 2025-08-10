import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';

// @desc    Register a new user
export const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ firstName, lastName, email, password });

  if (user) {
    const verificationToken = user.createVerificationToken();
    await user.save({ validateBeforeSave: false });

    // NOTE: For production, use your frontend URL. For testing, this works.
    const verifyURL = `${req.protocol}://${req.get('host')}/api/auth/verifyemail/${verificationToken}`;
    const message = `<h1>Email Verification</h1><p>Hi ${user.firstName}, please click the link below to verify your email. This link expires in 10 minutes.</p><a href="${verifyURL}">Verify Email</a>`;

    try {
      await sendEmail({ to: user.email, subject: 'Evently - Email Verification', html: message });
      res.status(201).json({ message: 'Registration successful! Please check your email to verify your account.' });
    } catch (error) {
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      await user.save({ validateBeforeSave: false });
      res.status(500);
      throw new Error('Email could not be sent. Please try again.');
    }
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Verify user's email
export const verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Token is invalid or has expired');
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  res.status(200).send('<h1>Email Verified Successfully!</h1><p>You can now close this tab and log in to your account.</p>');
});


// @desc    User login
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified) {
      res.status(401);
      throw new Error('Please verify your email before logging in.');
    }
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    User logout / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
});
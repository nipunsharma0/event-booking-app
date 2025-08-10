import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { email } from 'zod';

export const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: "User already exists"});
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        password
    });
    
    if(user) {
        generateToken(res, user._id);
    
        res.status(200).json({
            message: "User created Successfully",
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        });
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }
});


// @desc    User login
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      message: "User Logged in Successfully",
      _id: user._id,
      firstName: user.firstName,
      email: user.email,
      isAdmin: user.isAdmin
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" }); 
  }
});


// @desc    User logout / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = asyncHandler(async (req, res) => {

    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ messsage: "Logged out successfully" })
})
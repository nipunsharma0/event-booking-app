import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';


export const protect = asyncHandler(async (req, res, next) => {

    let token;
    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.userId).select('-password');
            
            next();

        } catch (error) {
            console.log(error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token found" });
    }
});

export const admin = (req, res, next) => {

    if (req.user && req.user.isAdmin) {
        
        next();
    } else {
        res.status(403).json({ messsage: "You are not an admin" })
    }
};
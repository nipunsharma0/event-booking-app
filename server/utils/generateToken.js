import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {

    const payload = { userId };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax",
        maxAge: 60 * 60 * 1000 // 1 hour
    });
}

export default generateToken;
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const authUser = async (req, res, next) => {

    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if(!decoded) {
            return res.status(401).json({ message: 'Token is not valid' });
        }
        
        req.user = await User.findById(decoded.userId).select('-password');
        if (!req.user) {
            return res.status(401).json({ message: 'User not found, authorization denied' });
        }
        next();
         
    } catch (error) {
        console.error('Error in auth middleware:', error);
        res.status(401).json({ message: 'Internal sever error' });
    }
};    

export { authUser };
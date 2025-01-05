const jwt = require('jsonwebtoken');
const userModel = require('../Models/Usermodel');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, "secret");
        const user = await userModel.findById(decoded.userid);
        console.log(user);
        

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        req.user = user;
        return next();
    } catch (err) {
        console.error('JWT verification failed:', err);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
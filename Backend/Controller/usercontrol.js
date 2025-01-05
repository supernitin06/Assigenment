const users = require('../Models/Usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const FriendRequest = require('../Models/Frndreq')

const signupuser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        const isUserAlready = await users.findOne({ email });
        if (isUserAlready) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const newUser = await users.create({
            name,
            email,
            password: hashedPassword,
            friends: [],
            friendRequestsSent: [],
            friendRequestsReceived: [],
        });

        const token = jwt.sign({ email: newUser.email, userid: newUser._id }, "secret");

        res.cookie('token', token, { httpOnly: true });

        res.status(201).json({
            message: 'User created successfully',
            user: { id: newUser._id, name: newUser.name, email: newUser.email },
            token: token,
        });
    } catch (err) {
        console.error('Error during signup:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


const loginuser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const isUser = await users.findOne({ email }).select('+password');
        if (!isUser) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, isUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ email: isUser.email, userid: isUser._id }, "secret");

        res.cookie('token', token, { httpOnly: true });

        res.status(200).json({
            message: 'Login successful',
            user: { id: isUser._id, name: isUser.name, email: isUser.email },
            token: token,
        });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const allusers = async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } },
            ],
        }
        : {};

    
    const userList = await users.find(keyword).find({ _id: { $ne: req.user._id } });
    res.status(200).json(userList);
};

const userlogout = async (req, res) => {
    res.clearCookie('token');

    res.status(200).json({ message: 'Logged out' });
};




module.exports = { signupuser, loginuser, userlogout, allusers };

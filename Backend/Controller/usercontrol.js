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


const AllFriendsReq = async (req, res, next) => {
    try {
        // Find the user and populate the friendRequestsSent field with only name and _id
        const user = await users.findById(req.user._id)
            .populate({
                path: 'friendRequestsSent',
                select: 'name _id' // Specify the fields to include
            });

        // Format the response to return only friendRequestsSent
        const friendRequestsSent = user.friendRequestsSent.map(friend => ({
            name: friend.name,
            _id: friend._id
        }));

        return res.status(200).json({ type: 'success', friendRequestsSent });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: 'error', error: error.message });
    }
};

const removeFriendRequest = async (req, res) => {
    try {
        const { friendId } = req.body; // Friend ID to be removed

        if (!friendId) {
            return res.status(400).json({ type: 'error', message: 'Friend ID is required' });
        }

        // Find the user and update the friendRequestsSent field
        const user = await users.findByIdAndUpdate(
            req.user._id, // Current user's ID from the middleware
            { $pull: { friendRequestsSent: friendId } }, // Remove the friendId
            { new: true } // Return the updated document
        ).populate({
            path: 'friendRequestsSent',
            select: 'name _id' // Optional: Include only name and _id
        });

        if (!user) {
            return res.status(404).json({ type: 'error', message: 'User not found' });
        }

        return res.status(200).json({
            type: 'success',
            message: 'Friend request removed successfully',
            friendRequestsSent: user.friendRequestsSent, // Updated list
        });
    } catch (error) {
        console.error('Error in removeFriendRequest:', error);
        return res.status(500).json({ type: 'error', message: error.message });
    }
};






module.exports = { signupuser, loginuser, userlogout, allusers , AllFriendsReq ,removeFriendRequest};

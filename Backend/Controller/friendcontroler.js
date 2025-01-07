const FriendModel = require('../Models/Frndreq')
const UserModel = require('../Models/Usermodel')


exports.addFriendReq = async (req, res, next) => {
    try {
        // Create a new friend request
        const addF = await FriendModel.create({ toId: req.body.toId, fromId: req.user._id });

        // Update the target user: add the current user to friendRequestsReceived
        await UserModel.findByIdAndUpdate(req.body.toId, {
            $addToSet: { friendRequestsReceived: req.user._id }, // Ensure uniqueness
        });

        // Update the current user: add the target user to friendRequestsSent
        await UserModel.findByIdAndUpdate(req.user._id, {
            $addToSet: { friendRequestsSent: req.body.toId }, // Ensure uniqueness
        });

        return res.status(200).json({ type: 'success', addF });
    } catch (error) {
        console.error('Error in addFriendReq:', error);
        return res.status(500).json({ type: 'error', message: error.message });
    }
};
exports.myAllFriendsReq = async (req, res, next) => {
    try {
        const allReq = await FriendModel.find({ fromId: req.user._id })
            .populate('toId', 'name email'); // Include only name and email for toId

      
        const formattedResponse = allReq.map(req => ({
        
            name: req.toId.name,
            email: req.toId.email
        }));

        return res.status(200).json({ type: 'success', formattedResponse });
    } catch (error) {
        console.log(error);
        return res.json({ type: 'error', error });
    }
};




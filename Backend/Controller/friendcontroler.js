const FriendModel = require('../Models/Frndreq')
const UserModel = require('../Models/Usermodel')


exports.addFriendReq = async (req, res, next) => {
    try {
        const addF = await FriendModel.create({ toId: req.body.toId, fromId: req.user._id });
        await UserModel.findByIdAndUpdate(req.body.toId, {
            $push: { friendRequestsReceived: req.user._id },
        });
        await UserModel.findByIdAndUpdate(req.user._id, {
            $push: { friendRequestsSent: req.body.toId },
        });
        return res.status(200).json({ type: 'success', addF });
    } catch (error) {
        console.log(error);
        return res.json({ type: 'error', error });
    }
};




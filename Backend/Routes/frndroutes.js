const express = require('express')
const FriendController = require('../Controller/friendcontroler')
const authMiddleware = require('../middleware/userauth');
const router = express.Router()


router.post('/add', authMiddleware.authUser , FriendController.addFriendReq)
router.post('/allsendreq', authMiddleware.authUser , FriendController.myAllFriendsReq)



module.exports = router
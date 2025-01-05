const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { signupuser  ,loginuser ,userlogout ,allusers} = require('../Controller/usercontrol');
const authMiddleware = require('../middleware/userauth');


router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  signupuser
);



router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address'),
    body('password')
      .isLength({min:6})
      .withMessage('Password must be at least 6 characters long'),
  ],
  loginuser
);


router.get('/logout', authMiddleware.authUser, userlogout)
router.get('/all', authMiddleware.authUser, allusers);



module.exports = router;

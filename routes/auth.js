const express = require('express')
const {
    register, 
    login, 
    getMe, 
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword,
    logout
} = require('../controllers/auth')

const router = express.Router()
const {protect} = require('../middleware/auth')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/me').get(protect, getMe)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resettoken',resetPassword)
router.put('/updatedetails',protect,updateDetails)
router.put('/updatepassword',protect,updatePassword)
router.get('/logout', logout)

module.exports = router
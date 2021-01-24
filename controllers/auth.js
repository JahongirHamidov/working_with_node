const ErrorResponse = require('../utils/errorResponse')
const User = require('../model/User')
const asyncHandler = require('../middleware/async')

// @desc    Register User
// @route   GET /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async(req,res,next) => {
    res.status(200).json({ success: true })
})
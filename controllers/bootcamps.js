// @desc            Get all bootcamps
// @route           GET /api/v1/bootcamps
// @access          Public
exports.getBootcamps = (req,res,next) => {
    res.status(200).json({success: true, msg: 'Show all bootcamps' })
}

// @desc            Get single bootcamp
// @route           GET /api/v1/bootcamps/:id
// @access          Public
exports.getBootcamp = (req,res,next) => {
    res.status(200).json({success: true, msg: `Get  bootcamp ${req.params.id}` })
}

// @desc            Post bootcamp
// @route           POST /api/v1/bootcamps/
// @access          Public
exports.postBootcamp = (req,res,next) => {
    res.status(200).json({success: true, msg: `Post  bootcamp` })
}

// @desc            Update bootcamp
// @route           PUT /api/v1/bootcamp/:id
// @access          Public
exports.putBootcamp = (req,res,next) => {
    res.status(200).json({success: true, msg: `Update bootcamp  ${req.params.id}` })
}
// @desc            Delete bootcamp
// @route           DELETE /api/v1/bootcamp/:id
// @access          Public
exports.deleteBootcamp = (req,res,next) => {
    res.status(200).json({success: true, msg: `Delete bootcamp ${req.params.id}`  })

}

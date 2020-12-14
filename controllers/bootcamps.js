const Bootcamp = require('../model/Bootcamp')
// @desc            Get all bootcamps
// @route           GET /api/v1/bootcamps
// @access          Public
exports.getBootcamps = (req,res,next) => {
    res.status(200).json({success: true, msg: 'Show all bootcamps', hello: req.hello })
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
exports.postBootcamp = async (req,res,next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body)
        
        res.status(201).json({
            success: true,
            data: bootcamp
        })
        
    } catch (error) {
        res.status(400).json({ success: false })
    }
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

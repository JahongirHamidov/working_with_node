const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../model/Bootcamp')
const errorHandler = require('../middleware/error')

// @desc            Get all bootcamps
// @route           GET /api/v1/bootcamps
// @access          Public
exports.getBootcamps = async (req,res,next) => {
    try {
        const bootcamps = await Bootcamp.find()
        res.status(200).json({
            count: bootcamps.length,
            success: true, 
            data: bootcamps
        })
    } catch (error) {
        next(error)
    }
}

// @desc            Get single bootcamp
// @route           GET /api/v1/bootcamps/:id
// @access          Public
exports.getBootcamp = async (req,res,next) => {
    try {
        
        const bootcamp = await Bootcamp.findById(req.params.id)
        
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))

        }
        
        res.status(200).json({
            success: true,
            data: bootcamp
        })
    } catch (error) {
        next(
        //    new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            error  
        )
    }
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
        next(error)
    }
}

// @desc            Update bootcamp
// @route           PUT /api/v1/bootcamp/:id
// @access          Public
exports.putBootcamp = async (req,res,next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if(!bootcamp){
            return res.status(400).json({success: false })
        }
        res.status(200).json({success: true, data: bootcamp})
    } catch (error) {
        next(error)
    }
}
// @desc            Delete bootcamp
// @route           DELETE /api/v1/bootcamp/:id
// @access          Public
exports.deleteBootcamp = async (req,res,next) => {

    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if(!bootcamp){
            return res.status(400).json({success: false })
        }
        res.status(200).json({success: true, data: {}})
    } catch (error) {
        next(error)
    }        
    
    
}

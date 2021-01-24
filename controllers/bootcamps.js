const path = require('path')
const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../model/Bootcamp')
const geocoder = require('../utils/geocoder')
const asyncHandler = require('../middleware/async')


// @desc            Get all bootcamps
// @route           GET /api/v1/bootcamps
// @access          Public
exports.getBootcamps = asyncHandler( async (req,res,next) => {
    let query

    //copy req.query
    const reqQuery = {...req.query}

    //fields to exclude 
    const removeFields = ['select', 'sort', 'page', 'limit']
    
    //loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param] )

    //create query string
    let queryStr = JSON.stringify(reqQuery)

    //create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`)
    
    //finding resource
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses')

    // Select fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ')
        console.log(fields)
        query = query.select(fields)
    }

    // Sort 
    if(req.query.sort){
        const sortBy= req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit =  parseInt(req.query.limit, 10) || 25
    const startIndex = (page-1) * limit
    const endIndex = page * limit
    const total = await Bootcamp.countDocuments()

    query = query.skip(startIndex).limit(limit)

    //executing query
    const bootcamps = await query

    //Pagination result
    const pagination = {}

    if(endIndex < total){
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if(startIndex > 0){
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.status(200).json({
        count: bootcamps.length,
        pagination,
        success: true, 
        data: bootcamps,
    })
})

// @desc            Get single bootcamp
// @route           GET /api/v1/bootcamps/:id
// @access          Public
exports.getBootcamp = asyncHandler(async (req,res,next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)    
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    
    res.status(200).json({
        success: true,
        data: bootcamp
    })
})

// @desc            Post bootcamp
// @route           POST /api/v1/bootcamps/
// @access          Public
exports.postBootcamp = asyncHandler( async (req,res,next) => {
    const bootcamp = await Bootcamp.create(req.body)
        
    res.status(201).json({
        success: true,
        data: bootcamp
    })
})

// @desc            Update bootcamp
// @route           PUT /api/v1/bootcamp/:id
// @access          Public
exports.putBootcamp = asyncHandler( async (req,res,next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    res.status(200).json({success: true, data: bootcamp})
})

// @desc            Delete bootcamp
// @route           DELETE /api/v1/bootcamp/:id
// @access          Public
exports.deleteBootcamp = asyncHandler( async (req,res,next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    bootcamp.remove()
    res.status(200).json({success: true, data: {}})        
})

// @desc            Get bootcamps within a radius
// @route           GET /api/v1/bootcamp/radius/:zipcode/:distance
// @access          Public
exports.getBootcampsInRadius = asyncHandler( async (req,res,next) => {
    const { distance, zipcode } = req.params

    //Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode)
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    //Calc radius using radians
    //Divide distance by radius of Earth
    //Earth radius = 3963 mi | 6378 km
    
    const radius = distance / 3963

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] }  }
    })
console.log(bootcamps)
    res.status(200).json({ 
        success: true,
        count: bootcamps.length,
        data: bootcamps 
    })
})

// @desc            Upload photo for bootcamp
// @route           PUT /api/v1/bootcamp/:id/photo
// @access          Private 
exports.photoUploadBootcamp = asyncHandler( async (req,res,next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
 
    if(!req.files){
        return next(new ErrorResponse(`Please upload  a file`, 400))
    }

    const file = req.files.file

    //Make sure the image is a photo
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse('Please upload an image file', 400))
    }

    // Check photo size
    if(file.size > process.env.MAX_FILE_UPLOAD){
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400))
    } 

    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err) {
            console.error(error)
            return next(new ErrorResponse(`Ploblem with file upload`, 500))
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name})

        res.status(200).json({
            success: true,
            data: file.name
        })
    })
})
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
    query = Bootcamp.find(JSON.parse(queryStr))

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
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
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


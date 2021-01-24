const express = require('express')
const router = express.Router()
const { 
    getBootcamps, 
    getBootcamp, 
    putBootcamp, 
    postBootcamp, 
    deleteBootcamp,
    getBootcampsInRadius,
    photoUploadBootcamp 
} = require('../controllers/bootcamps')

const Bootcamp = require('../model/Bootcamp')

const advancedResults = require('../middleware/advancedResults')

// Include other resource routers
const courseRouter = require('./courses')

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)


router
    .route('/radius/:zipcode/:distance')
        .get(getBootcampsInRadius)

router
    .route('/')
        .get( advancedResults( Bootcamp, 'courses'), getBootcamps)
        .post(postBootcamp)
router
    .route('/:id')
        .get(getBootcamp)
        .put(putBootcamp)
        .delete(deleteBootcamp)

router
    .route('/:id/photo')
        .put(photoUploadBootcamp)


module.exports = router
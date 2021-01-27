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

const {protect, authorize} = require('../middleware/auth')

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)


router
    .route('/radius/:zipcode/:distance')
        .get(getBootcampsInRadius)

router
    .route('/')
        .get( advancedResults( Bootcamp, 'courses'), getBootcamps)
        .post(protect,authorize('publisher', 'admin'), postBootcamp)
router
    .route('/:id')
        .get(getBootcamp)
        .put(protect,authorize('publisher', 'admin'), putBootcamp)
        .delete(protect,authorize('publisher', 'admin'), deleteBootcamp)

router
    .route('/:id/photo')
        .put(protect, authorize('publisher', 'admin'), photoUploadBootcamp)


module.exports = router
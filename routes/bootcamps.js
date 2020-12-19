const express = require('express')
const router = express.Router()
const { 
    getBootcamps, 
    getBootcamp, 
    putBootcamp, 
    postBootcamp, 
    deleteBootcamp,
    getBootcampsInRadius, 
} = require('../controllers/bootcamps')

router
    .route('/radius/:zipcode/:distance')
        .get(getBootcampsInRadius)

router
    .route('/')
        .get(getBootcamps)
        .post(postBootcamp)
router
    .route('/:id')
        .get(getBootcamp)
        .put(putBootcamp)
        .delete(deleteBootcamp)


module.exports = router
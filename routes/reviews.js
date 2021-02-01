const express = require('express')

const {
    getReviews,
    getReview,
    createReview,

} = require('../controllers/reviews')

const Review = require('../model/Reviews')

const router = express.Router({mergeParams: true})
const advancedResults = require('../middleware/advancedResults')
const {protect, authorize} = require('../middleware/auth')

router
    .route('/')
    .get(advancedResults(Review, {
        path: 'bootcamp',
        select: 'name description'
    }), getReviews)
    .post(protect, authorize('admin', 'user'), createReview)

router.route('/:id').get(getReview)

module.exports = router
const express = require('express');
const router = express.Router({mergeParams:true});


const Myerror = require('../error');
const ExpressError = require('../expresserror.js');

const Listning = require('../model/listning') //lsiting schema
const Review = require('../model/reivew.js')  //review schema

//require middleware
const {isLoggin,validationReview,IsReviewsowner} = require('../middleware.js');

const reviewController = require('../controller/review.js')


//for reviews 
router.post('/',isLoggin,validationReview,Myerror(reviewController.createreviews));

//for reveive delete
router.delete('/:reviewId',isLoggin,IsReviewsowner,Myerror(reviewController.destroyreview));

module.exports = router;
const express = require('express');
const router = express.Router();

const Myerror = require('../error');
const ExpressError = require('../expresserror.js');

const Listning = require('../model/listning') //lsiting schema
const Review = require('../model/reivew.js')  //review schema

//require middleware
const {isLoggin,Isowner} = require('../middleware.js');
const reivew = require('../model/reivew.js');

const listningController = require('../controller/listning.js')
// For File Upload
const multer  = require('multer')
const {storage} = require('../CloudeStorage')
const upload = multer({ storage})

router.get('/live-search', Myerror(listningController.searchListning));
router.get('/search', Myerror(listningController.searchResult));


router.route('/')
.get(Myerror(listningController.showAllListing) )
.post( isLoggin,
    upload.single('listning[image]'),
    Myerror(listningController.createListning)
)

//for new route  
router.get('/new',isLoggin,Myerror(listningController.newListning));

router.get('/:id/edit',isLoggin,Isowner,Myerror(listningController.editpage));
//read route
router.route('/:id')
.get( Myerror(listningController.showAllList))
.put(isLoggin,
    Isowner,
     upload.single('listning[image]'),
    Myerror(listningController.editListning
    ))
.delete(isLoggin,Isowner,Myerror(listningController.destroyroute))






module.exports = router;

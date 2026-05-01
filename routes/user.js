const express = require('express');
const router = express.Router();
const User = require('../model/user.js')  //user schema


const Myerror = require('../error');
const ExpressError = require('../expresserror.js');

const user = require('../model/user.js');
const passport = require('passport');
const { route } = require('./listing.js');

const usercontroller = require('../controller/user.js')

router.route('/signup')
.get(usercontroller.singuppageloading)
.post( usercontroller.singup)

router.route('/login')
.get(usercontroller.loginpageloading)
.post(usercontroller.login)

router.get('/logout', usercontroller.logout);

module.exports = router;

if(process.env.NODE_ENV != 'production'){
    require('dotenv').config()
}
// console.log(process.env.CLOUD_API_KEY)
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const mongoose = require('mongoose');

const Listning = require('./model/listning') //lsiting schema
const Review = require('./model/reivew.js')  //review schema
const User = require('./model/user.js')  //user schema
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate'); //require ejs-mate

const Myerror = require('./error');
const ExpressError = require('./expresserror.js');

const listingModel = require('./routes/listing.js');
const reviewModel = require('./routes/review.js');
const userModel = require('./routes/user.js');

// EXPRESS - SESSION
const session = require('express-session');
const MongoStore = require("connect-mongo");
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const atlasdburl = process.env.ATLASDB_URL; //MONGO_ATLAS
const store = MongoStore.create({
    mongoUrl: atlasdburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
});

store.on("error",()=>{
    console.log('Error In Mongo Session Store');
})

const sessionOption = {
    store:store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge :  7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
}



app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
res.locals.success = req.flash('success');
res.locals.error = req.flash('error');
res.locals.UserInfo = req.user;
 next()
})  


//server validation
const reviewsSchema = require('./validation.js');


const validationReview = (req, res, next) => {           
    const { error } = reviewsSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        next();
    }
}

main()
  .then(() => {
    console.log("DB connected");
    app.listen(PORT, () => {
      console.log("server started");
    });
  })
  .catch(err => console.log("DB Error:", err));

async function main() {
    await mongoose.connect(atlasdburl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); //for read body
app.use(methodOverride("_method"));

app.engine('ejs', ejsMate); //for ejs mate boiler

//for style.css
app.use(express.static(path.join(__dirname, 'public')))




//All listning Routes;

app.use('/listning', listingModel);
app.use('/listning/:id/reviews', reviewModel);
app.use('/', userModel);





//handle error
app.use((err,req,res,next)=>{
   if(res.headersSent) return next(err);
   res.status(err.status || 500).render('listing/error.ejs', { err });
});






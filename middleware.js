const Listning = require("./model/listning");
const Review = require('./model/reivew.js')  //review schema

const reviewsSchema = require('./validation.js');


module.exports.isLoggin = (req,res,next)=>{


if(!req.isAuthenticated()){
    if(req.method === 'GET'){
        req.session.redirectUrl = req.originalUrl
    }else{
       req.session.redirectUrl= req.headers.referer || '/listning';
    }
    req.flash('error','Login First!');
      return res.redirect('/login');
}
next();


};

module.exports.Isowner = async(req,res,next)=>{
   let id = req.params.id;
   let listing = await Listning.findById(id);
  //  console.log(listing.owner,'owner')
  //  console.log(res.locals.UserInfo)
   if(!listing.owner.equals(res.locals.UserInfo._id)){
    req.flash('error',"You Can't Access ");
    return res.redirect(`/listning/${id}`);
   }
   next()
}


module.exports.validationReview = (req,res,next)=>{
    const {error} = reviewsSchema.validate(req.body);

    if(error){
        return res.status(400).send(error.details[0].message);
    }else{
        next();
    }
}

module.exports.IsReviewsowner = async(req,res,next)=>{
   let { id,reviewId}= req.params;
   let review = await Review.findById(reviewId);
   //  console.log(res.locals.UserInfo)
   if(!review){
       req.flash("error","Review not found");
       return res.redirect(`/listning/${id}`);
    }
    //    console.log(review.author,'review')
   if(!review.author.equals(res.locals.UserInfo._id)){
    req.flash('error',"You Are't Author of This Review ");
    return res.redirect(`/listning/${id}`);
   }
   next()
}
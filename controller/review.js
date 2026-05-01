

const Listning = require('../model/listning') //lsiting schema
const Review = require('../model/reivew.js')  //review schema

module.exports.createreviews = async(req,res)=>{
    let id = req.params.id;
    let listning = await Listning.findById(id);
    let nReview = new Review(req.body.review);
    
   //  console.log( req.user,'auhtor'); 
    nReview.author = req.user._id;
    // console.log(nReview.author,'auhtor'); 
    listning.reviews.push(nReview);
    await nReview.save();
    await listning.save();
    
    req.flash("success", "Review Was Created!");
   res.redirect(`/listning/${listning._id}`)
};

module.exports.destroyreview = async(req,res)=>{
   let { id,reviewId}= req.params;
   await Listning.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  req.flash("success", "Review Was Deleted!");
   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/listning/${id}`);
}
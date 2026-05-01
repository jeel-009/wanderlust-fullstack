const mongoose = require('mongoose');
const { type } = require('../validation.js');
const { string } = require('joi');

const Schema = mongoose.Schema;

const listningSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description : String,
   image: String,  
    price:{
        type:Number,
        default:0
    },
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    geometry:{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      default:'Point',
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }

});

listningSchema.post('findOneAndDelete',async (Listing)=>{
    const Review = require('./reivew.js');

    if(Listing){
       await Review.deleteMany({_id:{$in:Listing.reviews}})
     }

})
const Listning = mongoose.model('Listning',listningSchema);

module.exports=Listning;


const mongoose = require('mongoose');
const { schema } = require('./listning');

const Schema = mongoose.Schema;

const reviewsSchema = new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    created_At:{
          type:Date,
        default:Date.now,
    },
    author:{
       type:Schema.Types.ObjectId,
               ref:'User'
    }
});

module.exports = mongoose.model('Review',reviewsSchema);


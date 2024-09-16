const mongoose= require('mongoose');
const Schema = mongoose.Schema;
const listingSchema= new Schema({
    title:{
        type:String,
        required: true,
    },
    description: String,
    image:{
        url: String,
        filename: String,

    }, 
    price: Number,
    location: String,
    country: String, 
    reviews :[{
        type: Schema.Types.ObjectId,
        ref: 'Reviews',
    }],
    owner : {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
});

const Listings= mongoose.model("Listings", listingSchema);
module.exports= Listings;
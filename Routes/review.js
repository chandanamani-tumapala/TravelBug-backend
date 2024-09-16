const express= require("express");
const router= express.Router({mergeParams: true});
const Listings = require("../models/listing");
const Reviews = require('../models/review');
const authenticateJWT= require('../middleware/jwtmiddleware');


//create new reviews 
router.post('/',authenticateJWT, async(req, res) => {
    let {id} = req.params;
    console.log('review is', req.body);
    try {
            if(!req.user || !req.user.id){
                console.log("unauthorized");
                return res.status(401).json({message: "unauthorized"});
            }
    let listing= await Listings.findById(id);
    let newreview= new Reviews(req.body);
    newreview.author= req.user.id;
    console.log(newreview);
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    res.status(201).json({listing: listing, message: 'Review added successfully'});
    }
    catch(err) {
        res.status(400).json({message:'Error adding review'});
    }
 
}); 

// delete reviews 
router.delete('/:reviewid', authenticateJWT, async(req,res)=> {
    let {id, reviewid}= req.params;
    console.log("id is ", id, "review id is ", reviewid);
    try {
        console.log('trying to delete review');
    let listing= await Listings.findByIdAndUpdate(id, {$pull: {reviews: reviewid}}, {new: true});
    console.log('listing is',listing);
    let deletedreview= await Reviews.findByIdAndDelete(reviewid);
    console.log('deleted review', deletedreview);
    res.status(201).json({message: 'Review deleted successful',deletedreview: deletedreview});
    }
    catch(err) {
        res.status(500).json({message:'Error deleting review'});
    }
}) 

module.exports= router;
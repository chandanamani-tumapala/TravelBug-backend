const express= require("express");
const router= express.Router();
const Listings = require("../models/listing");
const Reviews = require('../models/review');
const authenticateJWT= require('../middleware/jwtmiddleware');
const multer= require('multer');
const {storage} = require("../cloudConfig");
const upload= multer({storage});

//listing route 
router.get("/", async (req, res) => {
    try {
    const allListings = await Listings.find({});
    res.json(allListings);
    }
    catch(err) {
        res.status(500).json({message:'Error fetching listings'})
    }
});
//lisint route 
router.get('/mylisting',authenticateJWT, async(req, res) => {
    try {
        console.log("entered in mylisting");
        const userId= req.user.id;
        console.log(userId);
        const myListings= await Listings.find({owner:userId});
        console.log(myListings);
        res.status(200).json(myListings);

    }catch(err) 
    {
        console.log("error is listing my listings", err);
        res.status(500).json({message:'server error'});
    }
})
//show Route 
router.get("/:id", async (req, res) => {
    try {
    let {id} = req.params;
    const listing = await Listings.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author',  // Populate the author details in each review
            select: 'username email _id'  // Choose which fields to include from the author
        }
    }).populate('owner', 'username email _id');    console.log(listing);
    res.json(listing);
    }
    catch (err) {
        res.status(500).json({message: 'Error fetching listing'});
    }
});

//create route
router.post("/", authenticateJWT, upload.single("image"), async (req,res) => {
    console.log(req.file);
    let url = req.file.path;
    let filename= req.file.filename;
    console.log(url,"..", filename);
    console.log(req.user);
    try {
        if(!req.user || !req.user.id){
            console.log("unauthorized");
            return res.status(401).json({message: "unauthorized"});
        }
    // let {title, description, image, price, country, location}= req.body;
    let listing = req.body;
    const newListing = new Listings(listing);
    console.log("owner id ", req.user.id);
    newListing.image= {url,filename};
    newListing.owner=req.user.id;
    console.log("new listing is ", newListing);
    await newListing.save();
    res.status(201).json({message:'Listing created successfully!',newlisting: newListing});
    }
    catch(err) {
        console.log('error occured', err);
        res.status(400).json({message:'Error creating listing', error:err.message});
    }
})


//update route 
router.put("/:id",authenticateJWT, upload.single("image"),async(req, res) => {
    try{

    let {id} =req.params;
    console.log("id is ",id);
    let listing= await Listings.findById(id);
    console.log("listing is ", listing);
    if(!listing.owner.equals(req.user.id)){
        console.log("cannot edit");
        return res.json({message:"cannot be accesed"});
    }
    const updateData={...req.body};
    console.log(req.file)
    if (req.file) {
        const url = req.file.path;
        const filename = req.file.filename;
        updateData.image = {url,filename};
        console.log(updateData);
    }
    else{
        updateData.image= listing.image;
    }

    const updateListing= await Listings.findByIdAndUpdate(id, updateData,{new:true});
    console.log(updateListing);
    if(!updateListing){
        return res.status(404).json({message:"listing not found"});
    }
    res.json(updateListing)
}
catch(err) {
    console.error('error updating listing:',err);
    res.status(500).json({message:'Internal server error'});
}
})

//delete route
router.delete("/delete/:id",authenticateJWT, async(req, res) => {
        let {id} = req.params;
        console.log("id is ",id);
        try {
            let listing = await Listings.findById(id);
            if(!listing.owner.equals(req.user.id)){
                console.log("cannot edit");
                return res.json({message:"cannot be accesed"});
            };
            let deletedreview = await Reviews.deleteMany({_id: {$in: listing.reviews}});
            console.log(deletedreview);
        let deletedListing = await Listings.deleteOne({_id:id});
        if(deletedListing.deletedCount===0){
            return res.status(404).json({message:"Listing not found"});
        }
        console.log("deleted Listing", deletedListing);
        res.json({message:"Listing deleted successfully"});
    }
    catch(err) {
        console.error("Error deleting listing:", err);
        res.status(500).json({message:'Internal server error'});
    }
});

module.exports= router;
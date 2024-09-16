const mongoose= require("mongoose");
const initData= require("./data.js");
const Listings= require("../models/listing.js");
require('dotenv').config();

async function main() {
    console.log("URL is ", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

const initDB= async() => {
    await Listings.deleteMany({});
    initData.data= initData.data.map((obj) => ({...obj, owner:"owners id"}));
    const listing =await Listings.insertMany(initData.data);
    console.log(listing);
    console.log("Data is initialize");
}

main()
.then(()=>{
    console.log("Connected to DB");
    initDB();
})
.catch((err)=> {
    console.log("Error occurs ,",err);
})




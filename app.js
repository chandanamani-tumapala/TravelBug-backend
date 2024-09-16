const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require('express-session');
const methodOverride = require("method-override");
const cors= require("cors");
const flash = require('connect-flash');
const passport = require('passport');
const LocalStratergy = require('passport-local');
const multer = require('multer');
const upload = multer({dest: 'uploads/'})
require('dotenv').config();

const Users= require('./models/user.js');

const listingsRouter = require('./Routes/listing.js');
const listingidRouter= require('./Routes/review.js');
const userRouter= require('./Routes/user.js');


async function main() {
    await mongoose.connect(process.env.MONGO_URI);
}
main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log("Error occurs ,", err);
    })

app.use(cors({
    origin: 'http://localhost:3000', // or your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.urlencoded({extended: true}));
app.use(express.json());// add this line to parse JSON requests
app.use(methodOverride("_method"));

const sessionOptions = {
    secret:process.env.JWT_SECRET,
    resave: false,
    saveUninitialize: true,
    cookie: {
        expires: Date.now() + 7*24*60*100,
        maxage: 7*24*60*100,
        httpOnly: true
    }
    
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(Users.authenticate()));

passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

app.use((req,res,next) => {
    res.locals.success= req.flash("success");
    res.locals.currUser= req.user;
    next();
})

app.use('/listings',listingsRouter);
app.use('/listings/:id/reviews', listingidRouter);
app.use('/user',userRouter);



app.listen(process.env.PORT|| 8080, () => {
    console.log("Server listening on port : 8080 ");
});
const express= require("express");
const router= express.Router({mergeParams: true});
const Users= require('../models/user');
const passport = require("passport");
const jwt= require('jsonwebtoken');



router.post('/signup', async(req,res) => {
    try{
    let {username, email, password} = req.body;
    console.log("username" , username,"email", email, "password", password);

    //checking if user already exists
    const existingUser= await Users.findOne({username});
    if(existingUser) {
        return res.json({message: "Username is already taken"})
    }
    const newUser= new Users ({email, username});
    const registeruser= await Users.register(newUser, password);
    console.log(registeruser);
    res.json({msg:"user is login successfully"});
    }
    catch(err) {
        console.log("error is ", err);
    }
})

router.post('/signin', (req, res, next) => {
    passport.authenticate('local', {session: false}, (err,user, info)=> {
        if(err || !user) {
            return res.status(401).json({msg: "invalid username or password"});
        }
        // if user is authenticated, proceed for token creation
        req.login(user,{session: false}, (err) => {
            if(err) {
                return res.status(500).json({msg:"login error. please try again"});
            }

            //create a jwt token with the user information
            const token = jwt.sign({id: user._id, usernmae: user.username}, process.env.JWT_SECRET,{expiresIn: '1h'});
            return res.json({msg: "Login successful", token, user:{id: user._id, username: user.username}});
        });
    })(req, res, next);
});

module.exports= router;

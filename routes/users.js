const express = require('express');
const router = express.Router();

const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model('UserModel');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// create a user a new user
var testUser = new User();


    testUser.email = 'abina';
    testUser.name = 'abina';
    testUser.setPassword("abina");
    testUser.save();

// save user to database
router.post('/', function() {
    testUser.save(function(err){
        var token;
        if (err) {throw err;}
        else {
            token = user.generateJwt();
            res.status(200);
            res.json({"token": token});

        }
    });
}); 
        


router.post("/login",function(req,res){
    if(!req.body.username || !req.body.password){
        res.status(400);
        res.json({"message": "All fields required"});
        return;
    }

    passport.authenticate("local", function(err,user,info){
        var token;

        if (err) {
            console.log(err);
            res.status(404);
            res.json(err);
            return;
        }


        if(user){
            console.log(user);
            user.hello;
            token = user.generateJwt;
            res.status(200);
            res.json({"token":token});
        } else {
            console.log(info);
            res.status(401);
            res.json(info);
        }


    })(req,res);
});

module.exports = router;

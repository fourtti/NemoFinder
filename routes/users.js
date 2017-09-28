const express = require('express');
const router = express.Router();
const userCtrl = require('../models/Db_controllers/userCtrl');

const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model('UserModel');

//required for authentication of API routes
const jwt = require('express-jwt');
const auth = jwt({
    secret: 'thisIsSecret',
    userProperty: 'payload'
});




// returns a list of all users as an array contains hashes 'n stuff might want to delete in production 
router.get('/',function(req,res){
	var getUsers = userCtrl.getAllUsers();

	getUsers.then((data)=>{
		res.status(200);
		res.json(data);
	}).catch((err)=>{
		res.status(400);
		res.json(err);
	});
});

// create a user a new user
var testUser = new User();


    testUser.email = 'abina';
    testUser.name = 'abina';
    testUser.setPassword("abina");
    //testUser.save();

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
            token = user.generateJwt();
            console.log(token);
            res.status(200);
            res.json({"token":token});
        } else {
            console.log(info);
            res.status(401);
            res.json(info);
        }


    })(req,res);
});



router.get('/:id',auth,function(req,res){
    const userId = req.params.id;
    const findUser = userCtrl.findUser(userId);

    findUser.then((user)=>{
        res.status(200);
        res.json(user);
    }).catch((err)=>{
        res.status(400);
        res.json(user);
    });
});

module.exports = router;

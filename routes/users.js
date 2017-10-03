const express = require('express');
const router = express.Router();
const userCtrl = require('../models/Db_controllers/userCtrl');
let fishDataCtrl = require('../models/Db_controllers/fishdataCtrl');

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


router.post('/register',function(req,res){
    if(!req.body.email || !req.body.password || !req.body.name){
        res.status(400);
        res.json({message : 'All fields are required'});
        return;
    }
    userCtrl.createUser(req.body.name,req.body.email,req.body.password).then(()=>{
        res.status(200);
        res.json({message: 'user created successfully, you can now log in'});
    }).catch((err)=>{
        res.status(400);
        res.json(err);
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
            token = user.generateJwt();
            res.status(200);
            res.json({"token":token});
        } else {
            console.log(info);
            res.status(401);
            res.json(info);
        }


    })(req,res);
});


//returns the user details of parameter user. Requires authentication
router.get('/:id',auth, function(req,res){
    const userId = req.params.id;

    userCtrl.findUser(userId).then((user)=>{
        res.status(200);
        res.json(user);
    }).catch((err)=>{
        console.log(err);
        res.status(400);
        res.json(err);
    });
});


// returns all fishdata of parameter user as an array. Requires authentication
router.get('/:id/coordinates', auth,function(req,res){
    const userId = req.params.id;
    const findUser = userCtrl.findUser(userId);


    findUser.then((user)=>{
        userCtrl.findUserFishdata(userId).then((data)=>{
            res.status(200);
            res.json(data);
        }).catch((err)=>{
            console.log(err);
            res.status(400);
            res.json({message: err});
        });
    }).catch((err)=>{
        console.log(err);
        res.status(400);
        res.json({message: err});
    });
});

//creates new fishdata based on request body parameter. The new fisdata object is then saved into the fishadata collection
router.post('/:id/coordinates', auth, function(req,res){
    const userId= req.params.id;

    const long = parseFloat(req.body.long);
    const lat = parseFloat(req.body.lat);
    const depth = parseFloat(req.body.depth);
    const private = req.body.private;

    if(!long || !lat || !depth || !private){
        res.status(400);
        res.json({message: 'invalid request parameters'});
        return;
    }
    fishDataCtrl.createFishdata([long,lat],depth,userId,private).then((data)=>{
        userCtrl.userAddFishData(userId,data._id).then(()=>{
            res.status(200);
            res.json(data);
        }).catch((err)=>{

            res.status(400);
            res.json({message: err});
        });
    }).catch((err)=>{

        res.status(400);
        res.json({message: err});
    });

    
});

router.put('/:id/coordinates/:fishdataId', auth, function(req,res){
    const userId = req.params.id;
    const fishdataId = req.params.fishdataId;

    const long = parseFloat(req.body.long);
    const lat = parseFloat(req.body.lat);
    const depth = parseFloat(req.body.depth);
    //const owner = req.body.owner;
    const private = req.body.private;

    if(!long || !lat || !depth  || !private){
        res.status(400);
        res.json({message: 'invalid request parameters'});
        return;
    }
    fishDataCtrl.editFishdata(fishdataId,userId,[long,lat],depth,userId,private).then((data)=>{
        res.status(200);
        res.json(data);
    }).catch((err)=>{
        res.status(400);
        res.error(err);
    });
});

router.delete('/:id/coordinates/:fishdataId', auth, function(req,res){
    const userId = req.params.id;
    const fishdataId = req.params.fishdataId;

    fishDataCtrl.deleteFishdata(userId,fishdataId).then(()=>{
        userCtrl.userDeleteFishData(userId,fishdataId).then(()=>{
            res.status(200);
            res.json({message:'Fishdata deleted'});
        });
    }).catch((err)=>{
        console.log(err);
        res.status(400);
        res.json(err);
    });
});






module.exports = router;

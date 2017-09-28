var express = require('express');
var router = express.Router();
let userCtrl = require('../models/Db_controllers/userCtrl');

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
module.exports = router;

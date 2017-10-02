const express = require('express');
const router = express.Router();
const mapCtrl = require('../models/Db_controllers/mapCtrl');


//creates a new Map for the given user and saves it in the database
router.post('/new',function(req,res){
	let name = req.body.name;
	let fishdata = req.body.fishdata;
	let owner = req.body.owner;
	let private = req.body.private;


	if(!name || !fishdata || !private || !owner){
		res.status(400);
		res.json({message: "All parameters are requred!"});
	}

	mapCtrl.createNewMap(name,fishdata,owner,private).then((data)=>{
		res.stauts(200);
		res.json({message: "New map created successfully", data: data});
	}).catch((err)=>{
		res.status(400);
		res.json({message: "Error when creating a new Map", Error: err});
	});
	
});

//returns all public maps as an array
router.get('/public', function(req,res){
	mapCtrl.getPublicMaps().then((data)=>{
		res.status(200);
		res.json(data);
	}).catch((err)=>{
		res.status(400);
		res.json({message:"Error when fetching all public maps", Error: err});
	});
});

//returns single map object based on parameter id
router.get('/:id/',function(req,res){
	let id = req.params.id;

	mapCtrl.getMap(id).then((data)=>{
		res.status(200);
		res.json(data);
	}).catch((err)=>{
		res.status(400);
		res.json({message: "error when searching for given map", Error: err});
	});
});

//returns an arraý of the fishdata a map has reference to based on parameter id
router.get('/:id/fishdata',function(req,res){
	let id = req.params.id;

	mapCtrl.getMapFishdata(id).then((data)=>{
		res.status(200);
		res.json(data);
	}).catch((err)=>{
		res.status(400);
		res.json({message: "Error when searching for maps fishdata", Error: err});
	});
});


var express = require('express');
var router = express.Router();
let fishDataCtrl = require('../models/Db_controllers/fishdataCtrl');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.put('/local/X/:xParam/Y/:yParam/weight/:weightParam', function(req, res) {
	var newLocalFish = {
		X : xParam,
		Y : yParam,
		weight : weightParam
	};
	res.json(newLocalFish);
});

//Test route for adding a single fishdata to the database without owner
// REMEMBER TO DELETE BEFORE RETURN OF PROJECT AND REPLACE WITH CORRECT IMPLEMENTATION AFTER ATHENTICATION IS ADDED
router.post('/add/:long/:lat/:depth',function(req,res){
	
	let long = req.params.long;
	let lat = req.params.lat;
	let depth = req.params.depth;

	fishDataCtrl.createFishdata([long,lat],depth,false).then(()=>{
		res.status(200);
		res.json({message: 'FishData saved!'});
	}).catch((data)=>{
		res.status(200);
		res.json(data);
	});


});

//returns an array of all the fishdata inside given radius
router.get('/list',function(req,res){
	let maxDistance = req.query.maxDistance;
	let count = req.query.amount;
	let long = req.query.long;
	let lat = req.query.lat;
	if(!maxDistance || !count || !long || !lat){
		res.status(400);
		res.json({message: 'invalid request parameters!'});
		return;
	} else {
		let data = fishDataCtrl.getFishdata(maxDistance,count,long,lat);
		data.then((data)=>{
			res.status(200);
			console.log(data);
			res.json(data);
		}).catch((err)=>{
			res.status(400);
			res.json(err);
			throw err;
		});





	}


});


module.exports = router;
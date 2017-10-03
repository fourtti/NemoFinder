//required for database connection
const mongoose = require("mongoose");
let MapModel = mongoose.model("Map");
let User = mongoose.model("UserModel");
let fishModel = mongoose.model("fishData");

// creates a new map with given parameters and saves it in the database
module.exports.createNewMap = function(name,fishdata,owner,private){
	return new Promise((resolve,reject)=>{
		let newMap = new MapModel();

		newMap.name = name;
		newMap.fishdata = fishdata;
		newMap.owner = owner;
		newMap.private = private;

		newMap.save(function(err){
			if(err){
				console.log("could not create new map");
				reject(err);
			}
			resolve(newMap);
		});
	});
};

//returns a Promise that fetches the parameter Map from the database
module.exports.getMap = function(id){
	return new Promise((resolve,reject)=>{
		MapModel.findOne({_id:id}, function(err,map){
			if(err){
				console.log("Error when searching for given map");
				reject(err);
			}
			resolve(map);
		});
	});
};

//returns an arry of the fishdata the map has reference to 
module.exports.getMapFishdata = function(id){
	return new Promise((resolve,reject) =>{
		MapModel.findOne({_id:id}, function(err,map){
			if(err){
				console.log("Error when searching for given map");
				reject(err);
			}

			//converting all fishmap ids to objectID type
			fishmapIdArray = [];
			map.fishdata.forEach(function(i){
				fishmapIdArray.push(new mongoose.Types.ObjectId(i));
			});

			fishModel.find({
				'_id': { $in: fishmapIdArray}
			}, function(err,dataArray){
				if(err){
					console.log("something went wrong when searching for a maps fishdata");
					reject(err);
				}
				
				resolve(dataArray);
			});
		});
	});
};

//returns an array of all the maps that the given user owns
module.exports.getUserMaps = function(id){
	return new Promise((resolve,reject)=>{
		User.findOne({_id:id},function(err,foundUser){
			if(err){
				console.log("something went wrong when searching for user");
				reject(err);
			}
			MapModel.find({owner:foundUser._id},function(err,maps){
				if(err){
					console.log("something went wrong when searching for all the maps a user owns");
					reject(err);
				}
				resolve(maps);
			});
		});
	});
};

//returns an array of all the maps where private is false
module.exports.getPublicMaps = function(){
	return new Promise((resolve,reject)=>{
		MapModel.find({private:false}, function(err,maps){
			if(err){
				console.log("something went wrong when searching for all public maps");
				reject(err);
			}
			resolve(maps);
		});
	});
}

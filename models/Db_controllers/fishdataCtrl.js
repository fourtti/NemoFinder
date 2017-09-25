//required for database connection
const mongoose = require("mongoose");
let Fishdata = mongoose.model("FishData");


//Used for the calculations in geoNear options
let theEarth = (function () {
    let earthRadius = 6371; // km, miles is 3959

    let getDistanceFromRads = function (rads) {
        return parseFloat(rads * earthRadius);
    };

    let getRadsFromDistance = function (distance) {
        return parseFloat(distance / earthRadius);
    };

    return {
        getDistanceFromRads: getDistanceFromRads,
        getRadsFromDistance: getRadsFromDistance
    };
})();

//creates a new fishdata and saves it
module.exports.createFishdata = function(coords,depth,owner,private){
	let newData = new Fishdata();

	newData.coords = coords;
	newData.depth = depth;
	newData.owner = owner;
	newData.private = private;

	newData.save(function(err){
		if(err){
			console.log("could not save fishdata");
			throw err;
		}
	});
};

module.exports.getFishdata = function(maxDistance,count,lng,lat){
	let data;

	//Creating geoJSON point
	let point = {
		type:"Point",
		coordinates: [lng,lat]
	};
	//geoOptions are required by geoNear
	let geoOptions = {
        spherical: true,
        maxDistance: theEarth.getRadsFromDistance(maxDistance),
        num: count
    };

    Fishdata.geoNear(point,geoOptions,function(err,results,stats){
    	if (err){
    		console.log("searching with GeoNear did not work");
    		throw err;
    	}
    	data = results;
    });

    return data;
}
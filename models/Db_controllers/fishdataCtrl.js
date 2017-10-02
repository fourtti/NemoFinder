//required for database connection
const mongoose = require("mongoose");
let Fishdata = mongoose.model("fishData");


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
    return new Promise((response,reject)=>{

	let newData = new Fishdata();

	newData.coords = coords;
	newData.depth = depth;
	newData.owner = owner;
	newData.private = private;

	newData.save(function(err){
		if(err){
			console.log("could not save fishdata");
			reject(error);
		}
	});
    response();
});
};

//returns an array of fishdatas based on maxdistance and position
module.exports.getFishdata = function(maxDistance,count,lng,lat){
    return new Promise((response,reject)=>{
        let data;

        //Creating geoJSON point
        let point = {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
        };
        //geoOptions are required by geoNear
        let geoOptions = {
            spherical: true,
            maxDistance: theEarth.getRadsFromDistance(parseFloat(maxDistance)),
            num: parseFloat(count)
        };
        
        Fishdata.geoNear(point,geoOptions,function(err,results,stats){
        if (err){
            console.log("searching with GeoNear did not work");
            reject(err);
        }
        response(results);

        });


    });
}

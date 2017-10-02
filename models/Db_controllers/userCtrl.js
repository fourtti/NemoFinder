//required for database connection
const mongoose = require("mongoose");
let User = mongoose.model("UserModel");
let Fishdata = mongoose.model("fishData");



//function that returns a list of all users
module.exports.getAllUsers = function(){
	return new Promise((resolve,reject)=>{
		let users;

		//stores an array of all the documents in the User collection as an array
		User.find(function(err,userArray){
			if(err){
				console.log(err);
				reject(err);
			}
			resolve(userArray);
		});
	});
};


//returns user based on given id
module.exports.findUser = function(id){
	return new Promise((resolve,reject)=>{
		User.find({_id: id},function(err,foundUser){
		if(err){
			console.log("Could not find user based on id:" + id);
			console.log(err);
			reject(err);
		}
		resolve(foundUser);
		});
	});
};
//adds and saves parameter fishdata to user based on given id
module.exports.userAddFishData = function(id,fishdataId){
	return new Promise((resolve,reject)=>{

		

		User.findOne({_id: id},function(err,foundUser){
			if(err){
				console.log("Could not find user based on id:" + id);
				console.log(err);
				reject(err);
			}


			foundUser.fishdata.push(fishdataId);

			foundUser.save(function(err){
				if(err){
					console.log("could not add new fishdata to user");
					console.log(err);
					reject(err);
				}
			});
			resolve();
		});


	});

};

module.exports.userDeleteFishData = function(id,fishdataId){
	return new Promise((resolve,reject)=>{

		User.findOne({_id:id},function(err,foundUser){
			if(err){
				console.log("Something went wrong when looking for a user based on id");
				reject(err);
			}
			let index = foundUser.fishdata.indexOf(fishdataId);

			if(index > -1){
				foundUser.fishdata.splice(index,1);
			} else {
				reject({message: "could not find fishdata to delete"});
			}

			foundUser.save(function(err){
				if(err){
					console.log("something went wrong when trying to save the user");
					reject(err);
				}
				resolve();
			});
		});
	});
}

/*
//deletes given fishdata from given user based on id
module.exports.userDeleteFishData = function(id,fishdata){
	let user;

	User.find({_id: id},function(err,foundUser){
		if(err){
			console.log("Could not find user based on id:" + id);
			console.log(err);
			throw err;
		}
		user = foundUser;
	});

	let index = user.fishdata.indexOf(fishdata);
	if(index > -1){
		array.splice(index,1);
	} else {
		console.log("could not find fishdata to delete");
	}

	user.save(function(err){
		if(err){
			console.log("could not save changes to fishdata");
			console.log(err);
			throw err;
		}
	});
};*/ 

/*
//edit fishdata fields in given users fishdata
module.exports.userEditFishdata = function(id,fishDataId,newCoords,newDepth,newprivate){
	return new Promise((resolve,reject)=>{
	let user;

	User.find({_id: id},function(err,foundUser){
		if(err){
			console.log("Could not find user based on id:" + id);
			console.log(err);
			throw err;
		}
		user = foundUser;
	});

	let founduser = false;
	for(let i = 0; i < user.fishdata.size();i++){
		if(user.fishdata[i]._id == fishDataId){
			founduser = true;
			user.fishdata[i].coords = newCoords;
			user.fishdata[i].depth = newDepth;
			user.fishdata[i].timeStamp = Date.now();
			user.fishdata[i].private = newprivate;
		}
	}
	if(founduser === true){
		resolve();
	} else {
		reject('message: could not findUser');
	}
	
	});

	if (index < 0){
		console.log("This Fishdata does not belong to this user");
	} else {
		user.fishdata[index].coords = newFishdata.coords;
		user.fishdata[index].depth = newFishdata.depth;
		user.fishdata[index].timeStamp = newFishdata.timeStamp;
		user.fishdata[index].private = newFishdata.private;
	}

};*/

// creates a user in the database, remember to change when implementing passport
module.exports.createUser = function(name,email,password){
	return new Promise((resolve,reject)=>{
		let newUser = new User();

		newUser.name = name;
		newUser.email = email;
		newUser.setPassword(password);

		newUser.save(function(err){
		if(err){
			console.log("could not save new user to database.");
			reject(err);
		}
		resolve(err);
		});
	});
};

// find user fishdata
module.exports.findUserFishdata = function(userID){
	return new Promise((resolve,reject)=>{
			Fishdata.find({owner:userID},function(err,foundFishdata){
				if(err){
					console.log('Something went wrong when looking for the users fishdata');
					reject(err);
				}
				resolve(foundFishdata);
			});
	});
};


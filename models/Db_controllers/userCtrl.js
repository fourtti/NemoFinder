//required for database connection
const mongoose = require("mongoose");
let User = mongoose.model("UserModel");



//function that returns a list of all users
module.exports.getAllUsers = function(){
	return new Promise((response,reject)=>{
		let users;

		//stores an array of all the documents in the User collection as an array
		User.find(function(err,userArray){
			if(err){
				console.log(err);
				reject(err);
			}
			response(userArray);
		});
	});
};


//returns user based on given id
module.exports.findUser = function(id){
	let user;

	User.find({_id: id},function(err,foundUser){
		if(err){
			console.log("Could not find user based on id:" + id);
			console.log(err);
			throw err;
		}
		user = foundUser;
	});
	return user;
};
//adds and saves parameter fishdata to user based on given id
module.exports.userAddFishData = function(id,fishdata){
	let user;

	User.find({_id: id},function(err,foundUser){
		if(err){
			console.log("Could not find user based on id:" + id);
			console.log(err);
			throw err;
		}
		user = foundUser;
	});

	user.fishdata.push(fishdata);

	user.save(function(err){
		if(err){
			console.log("could not add new fishdata to user");
			console.log(err);
			throw err;
		}
	});

};
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
};


//edit fishdata fields in given users fishdata
module.exports.userEditFishdata = function(id,oldFishdata,newFishdata){
	let user;

	User.find({_id: id},function(err,foundUser){
		if(err){
			console.log("Could not find user based on id:" + id);
			console.log(err);
			throw err;
		}
		user = foundUser;
	});

	let index = user.fishdata.indexOf(oldFishdata);
	if (index < 0){
		console.log("This Dishdata does not belong to this user");
	} else {
		user.fishdata[index].coords = newFishdata.coords;
		user.fishdata[index].depth = newFishdata.depth;
		user.fishdata[index].timeStamp = newFishdata.timeStamp;
		user.fishdata[index].private = newFishdata.private;
	}

};

// creates a user in the database, remember to change when implementing passport
module.exports.createUser = function(name,email,password){
	let newUser = new User();

	newUser.username = name;
	newUser.email = email;
	newUser.setPassword(password);


	console.log(newUser);
	//saving new user to database. console logging if user creation did not work and throwing error
	newUser.save(function(err){
		if(err){
			console.log("could not save new user to database.");
			console.log(err);
		}
	});
};



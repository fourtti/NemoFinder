const mongoose = require('mongoose');
const crypto = require('crypto');
//const fishDataSchema = mongoose.model('fishData');
const jsonWebToken = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
	email: { type: String, unique: true, required: true },
	name: { type: String, required: true },
//>>>>>>> 5485caeaa0d20fdbeaf1ddc5f9f0c6ee1ec78c4e:models/schemas/users.js
	hash: String,
	salt: String
//	fishdata: [fishDataSchema]
	//{type: Array, required: false} 
	//[fishDataSchema]
});


//encrypts given password and sets users salt and hash
userSchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password,this.salt,1000,64,'sha1').toString('hex');
}

//checks if given password maches the hash of the user
userSchema.methods.validPassword = function(password){
	const hash = crypto.pbkdf2Sync(password,this.salt, 1000,64,'sha1').toString('hex');
	return this.hash === hash;
}

userSchema.methods.generateJwt = function(){
	let expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);

	return jsonWebToken.sign({
		_id: this._id,
		email: this.email,
		name: this.name,
		exp: parseInt(expiry.getTime() / 1000),  
	}, "thisIsSecret"); // CHANGE THIS BEFORE RETURNING TO TEACHER, ADD TO ENV VARIABLE. INSTRUCTIONS CAN BE FOUND IN THE GETTING MEAN BOOK
};


mongoose.model('UserModel',userSchema);
const mongoose = require('mongoose');
const crypto = require('crypto');
const fishDataSchema = mongoose.model('FishData').schema;
const jsonWebToken = require('jsonwebtoken');

const userSchema = new mongoose.schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	username:{
		type: String,
		required: true
	},
	hash: String,
	salt: String,
	fishData: [fishDataSchema]
});

//encrypts given password and sets users salt and hash
userSchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password,this.slat,1000,64).toString('hex');
}

//checks if given password maches the hash of the user
userSchema.methods.validPassword = function(password){
	const hash = crypto.pbkdf2Sync(password,this.salt, 1000,64).toString('hex');
	return this.hash === hash;
}

userSchema.method.generateJsonWebToken = function(){
	let expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);

	return jsonWebToken.sign({
		_id: this._id,
		email: this.email,
		username: this.username,
		exp: parseInt(expiry.getTime() / 1000),  
	}, "secret"); // CHANGE THIS BEFORE RETURNING TO TEACHER, ADD TO ENV VARIABLE. INSTRUCTIONS CAN BE FOUND IN THE GETTING MEAN BOOK
};


mongoose.model('User',userSchema);
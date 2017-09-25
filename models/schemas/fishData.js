const mongoose = require('mongoose');

const fishDataSchema = new mongoose.Schema({
	// remember to store coordinates in longitude, latitute order.
	coords: { type: [Number], index: '2dsphere', required:true},
	depth:{ type: String, required:true},
	timeStamp: {type: Date, "default": Date.now},
	owner :{ type: String },
	private: {type: Boolean}
});

mongoose.model('FishData', fishDataSchema);
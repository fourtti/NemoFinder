const mongoose = require('mongoose');

const fishDataSchema = new mongoose.Schema({
	// remember to store coordinates in longitude, latitute order.
	coords: { type: [Number], index: '2dsphere', required},
	depth:{ type: String, required},
	timeStamp: {type: Date, "default": Date.now},
	owner :{ type: String },
	private: {type: Boolean}
});

mongoose.model('FishData', fishDataSchema);
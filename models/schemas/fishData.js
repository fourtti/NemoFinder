const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fishDataSchema = new Schema({
	// remember to store coordinates in longitude, latitute order.
	coords: { type: [Number], index: '2dsphere', required: true },
	depth:{ type: String, required: true },
	timeStamp: {type: Date, "default": Date.now },
	owner :{ type: Schema.Types.ObjectId },
	private: { type: Boolean }

});

mongoose.model('fishData', fishDataSchema);
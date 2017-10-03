const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const map = new Schema({
	name: {type:String, required: true},
	fishdata: [{ type: Schema.Types.ObjectId }],
	timeStamp: {type: Date, "default": Date.now },
	owner:{ type: Schema.Types.ObjectId },
	private: { type: Boolean }
});

mongoose.model('Map', map);
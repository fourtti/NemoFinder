const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const map = new Schema({
	fishdata: [{ type: Schema.Types.ObjectId }],
	name: {type:String, unique: true, required: true},
	timeStamp: {type: Date, "default": Date.now },
	owner:{ type: Schema.Types.ObjectId },
	private: { type: Boolean }
});

mongoose.model('Map', map);
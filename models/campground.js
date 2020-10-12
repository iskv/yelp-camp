const mongoose = require("mongoose");

const campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment",
	}],
	author: {
		_id: { 
			type: mongoose.Schema.Types.ObjectId, 
			ref: "User",
		},
		username: String,
	},
	price: {
		type: Number,
		min: 0,
	},
});

module.exports = mongoose.model("Campground", campgroundSchema);
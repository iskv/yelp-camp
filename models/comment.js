const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
	text: String,
	author: {
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		username: String,
	},
	date: { 
		type: Date,
		default: Date.now
	},
});

module.exports = mongoose.model("Comment", commentSchema);
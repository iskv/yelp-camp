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
});

module.exports = mongoose.model("Comment", commentSchema);
// All the middleware goes here

const Campground = require("../models/campground");
const Comment = require("../models/comment");

const middlewareObj = {};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("/login");
	}
}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {		
		Campground.findById(req.params.id, (err, findCamp) => {
			if (err) {
				req.flash("error", "Campground not found");
				res.redirect("back");				
			} else if (findCamp.author._id.equals(req.user._id)) {
				next();
			} else {
				req.flash("error", "You don't have permission to that");
				res.redirect("back");
			}			
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {		
		Comment.findById(req.params.comment_id, (err, findComm) => {
			if (err) {
				req.flash("error", "Comment not found");
				res.redirect("back");				
			} else if (findComm.author._id.equals(req.user._id)) {
				next();
			} else {
				req.flash("error", "You don't have permission to that");
				res.redirect("back");
			}			
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

module.exports = middlewareObj;
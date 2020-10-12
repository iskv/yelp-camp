const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// INDEX - show all campgrounds
router.get("/", (req, res) => {
	const campgrounds = Campground.find({}, function(err, campgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: campgrounds});
		}
	});	
});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});

// SHOW - show more info about campground
router.get("/:id", (req, res) => {		
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if (err) {
			req.flash("error", "Campground not found");
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});	
})

// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, (req, res) => {	
	req.body.campground.author = req.user;
	Campground.create(req.body.campground, function(err, campground) {
		if (err) {
			req.flash("error", "Campground not created");			
		} else {
			req.flash("success", "Campground added");			
		}
		res.redirect("/campgrounds");
	});
});

// EDIT campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if (err) {
			req.flash("error", "Campground not found");
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/edit", { campground: foundCampground });
		}
	});
});

// UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {	
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updCamp) => {
		if (err) {
			req.flash("error", "Campground not found");
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Campground is updated");
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	});
});

// DESTROY campground router
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err, remCamp) => {
		if (err) {
			req.flash("error", "Campground not deleted");			
		} else {
			remCamp.comments.forEach((comment) => {
				Comment.findByIdAndRemove(comment._id, (err, remComment) => {
					if (err) {
						console.log(`error delete comment id ${comment._id}`);
					} else {
						console.log(`success delete comment id ${comment._id}`);
					}
				})
			})			
			req.flash("success", "Campground deleted");
		}
		res.redirect("/campgrounds");
	});
});

module.exports = router;
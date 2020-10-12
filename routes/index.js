const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

// Root route
router.get("/", (req, res) => {
	res.render("landing");
});

// =================================
// AUTH ROUTES
// =================================

// User register form
router.get("/register", (req, res) => {
	res.render("register");
});

// User CREATE
router.post("/register", (req, res) => {
	User.register(new User({
		username: req.body.username,
	}), req.body.password, (err, user) => {
		if (err) {
			req.flash("error", err.message);
			//res.render("register");
			res.redirect("/register");
		} else {
			passport.authenticate("local")(req, res, () => {
				req.flash("success", `Welcome to YelpCamp ${user.username}`);
				res.redirect("/campgrounds");
			});
		}
	});
});

// User login form
router.get("/login", (req, res) => {
	res.render("login");
});

// User login handler
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login",
	failureFlash: true,
}));

// User logout handler
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

module.exports = router;
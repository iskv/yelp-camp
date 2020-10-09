
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const methodOverride = require("method-override");
const seedDB = require("./seeds.js");
const flash = require("connect-flash");

// requiring routes
const commentRouters = require("./routes/comments");
const campgroundRouters = require("./routes/campgrounds");
const indexRouters = require("./routes/index"); 

let databaseurl = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
mongoose.connect(databaseurl, { 
	useNewUrlParser: true, 
	useUnifiedTopology: true, })
	.then(() => console.log('Connected to DB!'))
	.catch(error => console.log(error.message));

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "YelpCamp secret string",
	resave: false,
	saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for adding user to template context
app.use(function(req, res, next) {	
	res.locals.curUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// Routes
app.use("/", indexRouters);
app.use("/campgrounds", campgroundRouters);
app.use("/campgrounds/:id/comments", commentRouters);

//seedDB();

let port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log("Server Has Started");
});

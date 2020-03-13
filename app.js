var express 				= require('express'),
	app 					= express(),
	partials 				= require('express-partials'),
	bodyParser 				= require("body-parser"),
	mongoose 				= require("mongoose"),
	methodOverride 			= require("method-override"),
	expressSanitizer 		= require("express-sanitizer"),
	passport 				= require("passport"),
	LocalStrategy 			= require("passport-local"),
	passportLocalMongoose 	= require("passport-local-mongoose"),
	User 					= require("./models/user"),
	Test 					= require("./models/test"),
	LoginRecord 			= require("./models/login_record"),
	middleware				= require("./middleware"),
	flash			 		= require("connect-flash");

var	testRoutes 		= require("./routes/tests"),
	indexRoutes 	= require("./routes/index");

//mongoose.connect("mongodb://localhost/test_app");
mongoose.connect("mongodb+srv://akshit:**@testapp-sfi6g.mongodb.net/test?retryWrites=true&w=majority");
//mongodb+srv://akshit:**@testapp-sfi6g.mongodb.net/test?retryWrites=true&w=majority

app.use(require("express-session")({
	secret : "Akshit Bhatia",
	resave : false,
	saveUninitialized: false
}));

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(partials());
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.get("/student/:student_name", middleware.isLoggedIn, function(req,res){
	var student_name = req.params.student_name;
	if(req.user.username === student_name && !req.user.isdmin){
	LoginRecord.create({username:student_name},function(err, newLoginRecord){
		if(err){
			console.log(err);
		}
	})
	}
	if(req.user.username === student_name || req.user.isadmin){
	User.find({username: student_name}, function(err, user){
		if(err){
			console.log(err);
		} else {
			Test.find({student: student_name}, function(err, tests){
				if(err){
					console.log(err);
				} else {
					res.render("student_profile", {tests: tests, users:user});
				}
			});
		};
	});
} else {
	User.find({username: req.user.username}, function(err, user){
		if(err){
			console.log(err);
		} else {
			Test.find({student: req.user.username}, function(err, tests){
				if(err){
					console.log(err);
				} else {
					res.render("student_profile", {tests: tests, users:user});
				}
			});
		};
	});
}
});

app.get("/students", middleware.isLoggedIn, middleware.isAdmin, function(req,res){
	User.find({isadmin: false}, function(err, students){
		if(err){
			console.log(err);
		} else {
			res.render("students", {students: students});
		}
	});
});

app.get("/loginrecord", middleware.isLoggedIn, middleware.isAdmin, function(req,res){
	LoginRecord.find(function(err, loginRecords){
		if(err){
			console.log(err);
		} else {
			res.render("login_record", {loginRecords: loginRecords});
		}
	});
});

app.use(indexRoutes);
app.use("/tests", testRoutes);

app.get("*", function(req,res){
	res.send("invalid");
});

app.listen(process.env.PORT || 5000, process.env.IP, function(){
	console.log("app running");
});

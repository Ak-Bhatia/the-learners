var express 	= require("express"),
	router 		= express.Router(),
	passport 	= require("passport"),
	Test 		= require("../models/test"),
	User 		= require("../models/user"),
	middleware 	= require("../middleware");

router.get("/", function(req,res){
	res.render("index");
});

router.get("/register", function(req,res){
	res.render("register");
});

router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username, mobile: req.body.mobile, class: req.body.class, school: req.body.school})
	if(req.body.admincode === "thelearners12345"){
		newUser.isadmin = true;
	}
	User.register(newUser, req.body.password, function(err,user){
		if(err){
			req.flash("error", err.message);
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/");
		});
	})

})

router.get("/login", function(req,res){
	res.render("login");
});

router.post("/login", passport.authenticate("local",{
	successRedirect : "/",
	failureRedirect : "/login"
}), function(req, res){
});

router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "Logged Out");
	res.redirect("/");
});

module.exports = router;
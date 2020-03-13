var middlewareObj = {},
	LocalStrategy = require("passport-local");


middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login First");
	res.redirect("/");
 };

middlewareObj.isAdmin = function(req, res, next){
	if(req.user.isadmin){
		return next();
	}	
	req.flash("error", "You don't have permission for this");
	res.redirect("/");
};

module.exports = middlewareObj
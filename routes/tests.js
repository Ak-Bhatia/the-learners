var express = require("express"),
	router = express.Router(),
	Test = require("../models/test"),
	User = require("../models/user"),
	middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, middleware.isAdmin, function(req, res){
	Test.find({}, function(err, tests){
		if(err){
			console.log(err);
		} else {
			res.render("tests", {tests: tests});
		}
	});
});

router.get("/new", middleware.isLoggedIn, middleware.isAdmin, function(req,res){
	res.render("new_test");
});

router.post("/", middleware.isLoggedIn, middleware.isAdmin, function(req,res){
	req.body.test.body = req.sanitize(req.body.test.body);
	Test.create(req.body.test,function(err, newTest){
		if(err){
			console.log(err);
		} else {
			res.redirect("/tests");
		}
	});
});

router.get("/:id/edit", middleware.isLoggedIn, middleware.isAdmin, function(req,res){
	Test.findById(req.params.id, function(err, foundTest){
		if(err){
			cnosole.log(err);
		} else {
			res.render("test_edit",{ test: foundTest });			
		}
	});
});

router.put("/:id", middleware.isLoggedIn, middleware.isAdmin, function(req,res){
	req.body.test.body = req.sanitize(req.body.test.body);
	Test.findByIdAndUpdate(req.params.id, req.body.test, function(err, updatedTest){
		if(err){
			console.log(err);
		} else {
			res.redirect("/tests");
		}
	})
})

router.delete("/:id", middleware.isLoggedIn, middleware.isAdmin, function(req,res){
	Test.findByIdAndRemove(req.params.id, function(err, updatedTest){
		if(err){
			console.log(err);
		} else {
			res.redirect("/tests");
		}
	})
})

module.exports = router;
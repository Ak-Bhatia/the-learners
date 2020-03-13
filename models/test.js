var mongoose = require("mongoose");

var testSchema = new mongoose.Schema({
	chapter: String,
	subject: String,
	maxim_marks: Number,
	obtained_marks: Number,
	date: Date,
	student: String
});

module.exports = mongoose.model("Test", testSchema);

// Test.create({
// 	chapter: "punjabi"
// }, function(err, test){
// 	if(err){
// 		console.log("nope");
// 	} else{
// 		console.log(test.chapter);
// 	}
// });
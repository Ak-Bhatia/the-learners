var mongoose = require("mongoose");

var loginSchema = new mongoose.Schema({
	username: String,
	logintime: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("login", loginSchema);
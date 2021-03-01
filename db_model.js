var mongoose = require("mongoose");

var bfloc_location_schema = new mongoose.Schema({
	location: { type: String, unique: true } })

var bfloc_location = mongoose.model("bfloc_location", bfloc_location_schema);

var bfloc_business_function_schema = new mongoose.Schema({
	business_function: { type: String, unique: true } })

var bfloc_business_function = mongoose.model("bfloc_business_function", bfloc_business_function_schema);

var appSchema = new mongoose.Schema({
	process: String,
	current_app : String,
	future_app : String
})

var application = mongoose.model("application", appSchema);

var bflocSchema = new mongoose.Schema({
	business_function: String,
	location : String,
	applications: [appSchema]
})

var bfloc = mongoose.model("bfloc", bflocSchema);

var projectSchema = new mongoose.Schema({
	projectTitle: String,
	client: String,
	startDate: Date,
	created: {type: Date, default: Date.now }, 
	description: String,
	bfs_locs: [bflocSchema]
})

var project = mongoose.model("project", projectSchema);

module.exports = {
	project,
	bfloc,
	application,
	bfloc_business_function,
	bfloc_location
}

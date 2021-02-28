var bodyparser = require("body-parser");
var mongoose = require("mongoose");

var methodOverride = require("method-override");
var express = require("express");
var app = express();

const urlid = "mongodb+srv://rafaelnavarro:mypass@cluster0.mkp65.azure.mongodb.net/EA_Landscape?retryWrites=true&w=majority";
const urlid2 = "mongodb://localhost/pedlandscape"
mongoose.connect(urlid, {useNewUrlParser: true});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

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


//######################################################################################################################################
//    Routes for Projects
//######################################################################################################################################


//ROUTES:
app.get("/", (req, res) => { res.redirect("/projects")});

//Get projects
app.get(
	"/projects", 
	(req, res) => { 
		project.find({},
		(err, projects) => {
			if(err){ console.log("DataBase Error!!")}
			else { res.render("project", {projects: projects});}
		})
	}
);

//Create NEW project
app.get(
	"/projects/new", 
	(req, res) => {
		res.render("newProject");
	}
)

//POST NEW project
app.post(
	"/projects", 
	(req, res)=> {
	project.create(req.body.project, (err, newProject)=> {
		if(err){res.render("new")}
		else { res.redirect("/projects");}
	},
	{upsert:true})
})

//EDIT project
app.get(
	"/projects/:id", 
	(req, res)=> {
		project.findById(
			req.params.id, 
			(err, foundProject)=> {
				if(err){alert("ERROR FINDING PROJECT..."); res.redirect("/projects");}
				else { res.render("editProject", {project:foundProject});}
			}
		)
	}
)

//PUT UPDATES IN project
app.put(
	"/projects/:id", 
	(req, res)=> {
		project.findByIdAndUpdate(
			req.params.id, 
			req.body.project,
			(err, updatedProject)=>{
				if(err){res.redirect("/projects");}
				else { res.redirect("/projects");}
			}
		);
	}
)

//######################################################################################################################################
//    Routes for Business Functions
//######################################################################################################################################

//Get business functions
app.get(
	"/business_functions", 
	(req, res) => { 
		bfloc_business_function.find(
			{},
			(err, bfloc_business_functions) => {
				if(err){ console.log("DataBase Error!!")}
				else { res.render("business_functions", {bfloc_business_functions: bfloc_business_functions, edit: false});}
			}
		)
	}
);

//POST NEW business function
app.post(
	"/business_functions/new", 
	(req, res)=> {
		bfloc_business_function.create(
			req.body.bfloc, 
			(err, newBF)=> {
				if(err){ res.redirect("/business_functions"); console.log("This element already exists");}
				else { res.redirect("/business_functions");}
			}
		)
	}
)

//Edit business_functions
app.get("/business_functions/:id/edit",(req, res)=>{
		bfloc_business_function.find({}, (err, bfloc_business_functions) => {
		if(err){ console.log("DataBase Error!!")}
		else { 
			bfloc_business_function.findById(req.params.id, (err, business_function)=> {
			if(err){ res.redirect("/projects");}
			else { res.render("business_functions", {bfloc_business_functions: bfloc_business_functions, business_function: business_function, edit: true});}
	})}})})
	

//PUT update business_function
app.put("/business_functions/:id/edit",  (req, res)=> {	bfloc_business_function.findById(req.params.id, (err, foundBF)=> {
		if(err) { alert("ERROR FINDING PROJECT..."); res.redirect("/projects");}
		else { foundBF.business_function=req.body.bfloc.business_function;
			   foundBF.save( (err, foundBF)=> {
					if(err){alert("ERROR SAVING BUSINESS FUNCTION...");}
					else {res.render("business_functions", {bfloc_business_functions:foundBF});}
				})
			}}) 
		res.redirect("/business_functions");
})



//######################################################################################################################################
//    Routes for Locations
//######################################################################################################################################


//Get Locations
app.get("/locations", (req, res) => { 
	bfloc_location.find({}, (err, bfloc_locations) => {
		if(err){ console.log("DataBase Error!!")}
		else { res.render("locations", {bfloc_locations: bfloc_locations, edit: false});}
		})
	});

//POST NEW locations
app.post("/locations/new", (req, res)=> {
	bfloc_location.create(req.body.bfloc, (err, newLOC)=> {
		if(err){ res.redirect("/locations"); console.log("This element already exists");}
		else { res.redirect("/locations");}
	})
})

//Edit locations
app.get("/locations/:id/edit",(req, res)=>{
		bfloc_location.find({}, (err, bfloc_locations) => {
		if(err){ console.log("DataBase Error!!")}
		else { 
			bfloc_location.findById(req.params.id, (err, location)=> {
			if(err){ res.redirect("/locations");}
			else { res.render("locations", {bfloc_locations: bfloc_locations, location: location, edit: true});}
	})}})})
	

//PUT update locations
app.put(
	"/locations/:id/edit",  
	(req, res)=> {	
		bfloc_location.findById(
			req.params.id, 
			(err, foundLOC)=> {
				if(err) { 
					alert("ERROR FINDING PROJECT..."); 
					res.redirect("/projects");
				}
				else { 
					foundLOC.location=req.body.bfloc.location;
					foundLOC.save( (err, foundLOC)=> {
						if(err){
							alert("ERROR SAVING BUSINESS FUNCTION...");
						}
						else {
							res.render(
								"locations", 
								{bfloc_locations:foundLOC});
						}
					})
                }
			}) 
		res.redirect("/locations");
	}
)



//######################################################################################################################################
//    Routes for BFLOCS
//######################################################################################################################################

var myBF;
var myLOC;
var errorBFL;

//Get BFLOCS
app.get("/projects/:id/bflocs",(req, res)=>{
	project.findById(req.params.id, (err, foundProject)=> {
		if(err){alert("ERROR FINDING PROJECT..."); res.redirect("/projects");}
		else { 	
			bfloc_location.find({}, (err, locations) => {
				if(err){ console.log("DataBase Error!!")}
				else { myLOC = locations; }
				})
			bfloc_business_function.find({}, (err, business_functions) => {
				if(err){ console.log("DataBase Error!!")}
				else { myBF = business_functions; res.render("editBfloc", {project:foundProject, business_functions:myBF, locations: myLOC, edit: false, errors:errorBFL });}
				})}					
	});
})

//Add new BFLOC
app.post("/projects/:id/bflocs/new", 
	 (req, res)=> {	project.findById(req.params.id, (err, foundProject)=> {
		errorBFL = "";
		if(err) { console.log("ERROR FINDING PROJECT..."); res.redirect("/projects");}
		else {  
			project.find({bfs_locs:{ $elemMatch: { location:req.body.bfloc.location, business_function:req.body.bfloc.business_function}}}, 
						 (err, docs) => {
				if(err){ console.log("Database Error"); next();}
				else { 
					if(!docs.length) 
					{
						foundProject.bfs_locs.push(req.body.bfloc);
						foundProject.save( (err, project)=> {
							if(err){console.log("ERROR SAVING PROJECT...");}
							else {res.render("editBfloc", {project:project, business_functions:myBF, locations: myLOC});}
						})
					}else
					{
						console.log("This Location and Business Function already exist!");
						errorBFL = "The selected item already exist."
					}
				}
			})
			}}) 
		res.redirect("/projects/"+ req.params.id +"/bflocs/");
		})

//Edit BFLOC
app.get("/projects/:id/bflocs/:idbf/edit",(req, res)=>{
	project.findById(req.params.id, (err, foundProject)=> {
		if(err){alert("ERROR FINDING PROJECT..."); res.redirect("/projects");}
		else { res.render("editBfloc", {project:foundProject, bflocID: req.params.idbf, business_functions:myBF,locations: myLOC, edit: true});}
	});
})

//PUT update BFLOC
app.put("/projects/:id/bflocs/:idbf",  (req, res)=> {	project.findById(req.params.id, (err, foundProject)=> {
		if(err) { alert("ERROR FINDING PROJECT..."); res.redirect("/projects");}
		else { foundProject.bfs_locs.id(req.params.idbf).business_function=req.body.bfloc.business_function;
			  foundProject.bfs_locs.id(req.params.idbf).location=req.body.bfloc.location;
			   foundProject.save( (err, project)=> {
					if(err){alert("ERROR SAVING PROJECT...");}
					else {res.render("editBfloc", {project:project, business_functions:myBF,locations: myLOC});}
				})
			}}) 
		res.redirect("/projects/"+ req.params.id +"/bflocs/");
})


//######################################################################################################################################
//    Routes for Applications
//######################################################################################################################################



//Get Applications
app.get("/projects/:id/bflocs/:idbf/applications",(req, res)=>{
	project.findById(req.params.id, (err, foundProject)=> {
		if(err){console.log("ERROR FINDING PROJECT..."); res.redirect("/projects");}
		else { res.render("editApp", {project:foundProject, bflocID: req.params.idbf, edit: false});}
	});
})

//Add new Applications
app.post("/projects/:id/bflocs/:idbf/applications/new", 
	 (req, res)=> {	project.findById(req.params.id, (err, foundProject)=> {
		if(err) { console.log("ERROR FINDING PROJECT..."); res.redirect("/projects");}
		else { 
			console.log("Adding Application")
			
			//Verify whether the process exist or not before adding it.
			project.find({"bfs_locs.applications":{ $elemMatch:
				{process : req.body.application.process}}},
			(err, docs) => {
				console.log(docs);
				if(err){ console.log("Database Error"); next();}
				else
				{
					if(!docs.length)
					{	
						foundProject.bfs_locs.id(req.params.idbf).applications.push(req.body.application);
						foundProject.save( (err, project)=> { 
							if(err){ console.log("ERROR SAVING PROJECT...");} 
							else {res.render("editApp", {project:project, bflocID:req.params.idbf});}})
					
					}
					else{
						
						console.log("ERROR SAVING APPLICATION");
						errorApp = "The selected process already exist.";
					}
				}
			})
		}
	}) 
	res.redirect("/projects/"+ req.params.id +"/bflocs/" + req.params.idbf + "/applications");
})

/* - ORIGINAL
//Add new Applications
app.post("/projects/:id/bflocs/:idbf/applications/new", 
	 (req, res)=> {	project.findById(req.params.id, (err, foundProject)=> {
		if(err) { alert("ERROR FINDING PROJECT..."); res.redirect("/projects");}
		else { 
			
			//INCLUDE APP CHECK HERE
			
			foundProject.bfs_locs.id(req.params.idbf).applications.push(req.body.application);
			foundProject.save( (err, project)=> { if(err){ console.log("ERROR SAVING PROJECT...");} else {res.render("editApp", {project:project});}})
		}
	}) 
	res.redirect("/projects/"+ req.params.id +"/bflocs/" + req.params.idbf + "/applications");
})
*/


//Edit Application
app.get("/projects/:id/bflocs/:idbf/applications/:idapp/edit",(req, res)=>{
	project.findById(req.params.id, (err, foundProject)=> {
		if(err){alert("ERROR FINDING PROJECT..."); res.redirect("/projects");}
		else { res.render("editApp", {project:foundProject, bflocID: req.params.idbf, idapp: req.params.idapp, edit: true});}
	});
})

//PUT update Application
app.put("/projects/:id/bflocs/:idbf/applications/:idapp",  (req, res)=> {	project.findById(req.params.id, (err, foundProject)=> {
		if(err) { alert("ERROR FINDING PROJECT..."); res.redirect("/projects");}
		else { foundProject.bfs_locs.id(req.params.idbf).applications.id(req.params.idapp).process = req.body.application.process;
			   foundProject.bfs_locs.id(req.params.idbf).applications.id(req.params.idapp).current_app = req.body.application.current_app;
			   foundProject.bfs_locs.id(req.params.idbf).applications.id(req.params.idapp).future_app = req.body.application.future_app;
			   foundProject.save( (err, project)=> {
					if(err){alert("ERROR SAVING PROJECT...");}
					else {res.render("editBfloc", {project:project});}
				})
			}}) 
		res.redirect("/projects/"+ req.params.id +"/bflocs/" + req.params.idbf + "/applications");
})

app.listen(3000, () => { console.log("Server listening on port 3000..."); });

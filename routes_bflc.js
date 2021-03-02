const { 
    project,
    bfloc,
    bfloc_location,
    bfloc_business_function } = require("./db_model.js")

var myBF;
var myLOC;
var errorBFL;

exports.list = function(req, res){
	project.findById(req.params.id_pro, (err, foundProject)=> {
		if(err){
            console.log("ERROR FINDING PROJECT...");
            res.redirect("/projects");
        } else { 	
			bfloc_location.find({}, (err, locations) => {
				if(err){ 
                    console.log("ERROR FINDING LOCATIONS...")
                } else { 
                    myLOC =  locations.copyWithin();
                    bfloc_business_function.find({}, (err, business_functions) => {
                        if(err){ 
                            console.log("DataBase Error!!")
                        } else { 
                            myBF =  business_functions.copyWithin();
                            res.render("editBfloc", {project:foundProject, business_functions:business_functions, locations: locations, edit: false, errors:errorBFL });}
                        })
                }
				})
			}					
	});
};

exports.new = function(req, res){};

exports.delete = function(req, res){};
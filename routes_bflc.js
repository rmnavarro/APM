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

exports.add_bflc = function(req, res) {
    project.findById(req.params.id_pro, (err, foundProject)=> {
    let errorBFL = '';
    let BFL_exist = false;
    if(err) { 
        console.log("ERROR FINDING PROJECT..."); 
        res.redirect("/projects");
    } else {  

        for(i=0;i<foundProject.bfs_locs.length;i++){
            if( foundProject.bfs_locs[i].location == req.body.bfloc.location
                && 
                foundProject.bfs_locs[i].business_function == req.body.bfloc.business_function)
                {
                    console.log("This Location and Business Function already exist!");
                    BFL_exist = true;
                    errorBFL = "The selected item already exist."
                    break;
                }
        }            
        if(!BFL_exist) {
            foundProject.bfs_locs.push(req.body.bfloc);
            foundProject.save( (err, savedProject)=> {
                if(err){
                    console.log("ERROR SAVING PROJECT...");
                } else {
                    console.log("Adding Business Function and location.")
                    res.redirect("/project/"+ req.params.id_pro +"/bf_lc");
                    /*res.render("editBfloc", {project:savedProject, business_functions:myBF, locations: myLOC, edit: false, errors:errorBFL},
                    (err, html)=> {
                        if(!err){ res.send(html)}
                    });*/
                }
            })
        } else {
            console.log("Rendering new template.")
            res.render("editBfloc", {project:foundProject, business_functions:myBF, locations: myLOC, edit: false, errors:errorBFL});
        }
    }}) 

    //res.redirect("/project/"+ req.params.id_pro +"/bf_lc");
};

exports.edit_bflc = function(req, res){
	project.findById(req.params.id_pro, (err, foundProject)=> {
		if(err){
            console.log("ERROR FINDING PROJECT..."); 
            res.redirect("/projects");
        } else { 
            res.render("editBfloc", 
                {project:foundProject,
                 bflocID: req.params.id_bflc, 
                 business_functions:myBF,
                 locations: myLOC, 
                 edit: true, 
                 errors:''});}
	});
};

exports.save_bflc = function(req, res) {	
    project.findById(req.params.id_pro, (err, foundProject)=> {
        if(err) { 
            console.log("ERROR FINDING PROJECT..."); 
            res.redirect("/projects");
        } else { 
            foundProject.bfs_locs.id(req.params.id_bflc).business_function=req.body.bfloc.business_function;
            foundProject.bfs_locs.id(req.params.id_bflc).location=req.body.bfloc.location;
            foundProject.save( (err, project)=> {
                if(err){
                    console.log("ERROR SAVING PROJECT...");
                } else {
                    res.render("editBfloc", 
                        {project:project, 
                        business_functions:myBF,
                        locations: myLOC});}
            })
        }}) 
    res.redirect("/project/"+ req.params.id_pro + "/bf_lc");
}

exports.delete = function(req, res){};
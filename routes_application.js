const { 
    project,
    bfloc,
    bfloc_location,
    bfloc_business_function } = require("./db_model.js")


exports.list = function(req, res){
	project.findById(req.params.id_pro, (err, foundProject)=> {
		if(err){
            console.log("ERROR FINDING PROJECT..."); 
            res.redirect("/projects");
        } else { 
            res.render("editApp", {project:foundProject, bflocID: req.params.id_bflc, edit: false, errors: ''});}
	});
}

exports.add_application = function(req, res){	
    let errorApp;
    let process_exist = false;
    project.findById(req.params.id_pro, (err, foundProject)=> {
        if(err){ 
            console.log("ERROR FINDING PROJECT..."); 
            res.redirect("/projects");
        } else { 
                
            //Verify whether the process exist or not before adding it.
            for(let i=0; i<foundProject.bfs_locs.id(req.params.id_bflc).applications.length; i++) {
                if(foundProject.bfs_locs.id(req.params.id_bflc).applications[i].process == req.body.application.process){
                    process_exist = true;
                    errorApp = "The selected process already exist.";
                    break;
                };
            };

            if(!process_exist){
                foundProject.bfs_locs.id(req.params.id_bflc).applications.push(req.body.application);
                foundProject.save( (err, savedProject)=> { 
                    if(err){ 
                        console.log("ERROR SAVING PROJECT...");} 
                    else {
                        console.log("Adding application and process...")
                        res.redirect("/project/"+ req.params.id_pro +"/bf_lc/" + req.params.id_bflc + "/applications");                      
                    }
                });
            } else {
            
                res.render("editApp", {project:foundProject, bflocID:req.params.id_bflc, edit: false, errors:errorApp});
            }                  
        }            
    })
    
};

exports.edit_application = function(req, res){
	project.findById(req.params.id_pro, (err, foundProject)=> {
		if(err){
            console.log("ERROR FINDING PROJECT..."); 
            res.redirect("/projects");
        } else { 
            res.render("editApp", {project:foundProject, bflocID: req.params.id_bflc, idapp: req.params.id_app, edit: true, errors: ''});}
	});
};

exports.save_application = function(req, res){	
    project.findById(req.params.id_pro, (err, foundProject)=> {
        if(err) { 
            console.log("ERROR FINDING PROJECT..."); 
            res.redirect("/projects");
        } else { 
            foundProject.bfs_locs.id(req.params.id_bflc).applications.id(req.params.id_app).process = req.body.application.process;
            foundProject.bfs_locs.id(req.params.id_bflc).applications.id(req.params.id_app).current_app = req.body.application.current_app;
            foundProject.bfs_locs.id(req.params.id_bflc).applications.id(req.params.id_app).future_app = req.body.application.future_app;
            
            foundProject.save( (err, savedProject)=> {
                if(err){
                    console.log("ERROR SAVING PROJECT...");
                }else {
                    res.redirect("/project/"+ req.params.id_pro +"/bf_lc/" + req.params.id_bflc + "/applications");
                }
            });
        }
    })
};
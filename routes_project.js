const { project } = require("./db_model.js")

exports.redirect = function(req, res) { 
    res.redirect("/projects");
};

exports.list = function(req, res) { 
    project.find({},
    (err, projects) => {
        if(err){ console.log("DataBase Error!!")}
        else { res.render("project", {projects: projects});}
    })
};

exports.new = function(req, res) {
    res.render("newProject");
}

exports.add_project = function(req, res) {
    project.create(req.body.project, function(err){
		if(!err){
            res.redirect("/projects");
        } else { 
            res.send({"ERROR":"There was an error saving the new project."})
        }
	})
    
} ;

exports.edit_project = function(req, res) {
    project.findById(
        req.params.id_pro, 
        (err, foundProject)=> {
            if(err){alert("ERROR FINDING PROJECT..."); res.redirect("/projects");}
            else { res.render("editProject", {project:foundProject});}
        }
    )
}

exports.save_project = function(req, res) {
    project.findByIdAndUpdate(
        req.params.id_pro, 
        req.body.project,
        (err, updatedProject)=>{
            if(!err){
                console.log("NO ERROR SAVING PROJECT");
                res.redirect("/projects");
            } else { 
                console.log("ERROR WHILE SAVING PROJECT");
                res.redirect("/projects");
            }
        }
    );
}
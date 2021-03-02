let express = require("express");
let app = express();

//Include body parser to convert payload from HTML Forms.
let bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended: true}));

let project_route = require('./routes_project.js');
let bflc_route = require('./routes_bflc.js');
let application_route = require('./routes_application.js');

const SERVER_PORT = 3000;

exports.module = app;

app.set("view engine", "ejs");

//Routes definition.

app.get('/', project_route.redirect )
app.get('/projects', project_route.list )
app.get('/project/new', project_route.new )
app.post('/project/new', project_route.add_project )
app.get('/project/:id_pro/edit', project_route.edit_project )
app.post('/project/:id_pro/edit', project_route.save_project )

app.get('/project/:id_pro/bf_lc', bflc_route.list )
app.post('/project/:id_pro/bf_lc/new', bflc_route.add_bflc) 
app.get('/project/:id_pro/bf_lc/:id_bflc/edit', bflc_route.edit_bflc)
app.post('/project/:id_pro/bf_lc/:id_bflc/edit', bflc_route.save_bflc)

//app.get('/project/:id_pro/bf_lc/:id_bflc/delete', bflc_route )

//app.get('/project/:id_pro/bf_lc/:id_bflc/applications', application_route )
//app.get('/project/:id_pro/bf_lc/:id_bflc/applications/new', application_route )
//app.get('/project/:id_pro/bf_lc/:id_bflc/applications/:id_app/edit', application_route )
//app.get('/project/:id_pro/bf_lc/:id_bflc/applications/:id_app/delete', application_route )

//Start listening the server's port.
app.listen(SERVER_PORT, 
    () => { console.log("Server listening on port " + SERVER_PORT + "..."); 
});
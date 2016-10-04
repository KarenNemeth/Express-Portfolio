const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
// const description = require('/description.json');
const hb = require('express-handlebars');
const fs = require('fs');
app.engine('handlebars', hb());
app.set('view engine', 'handlebars');
var url;

console.log("I'm listening!");
app.use(bodyParser.urlencoded({
    extended:false
}));

app.use(cookieParser());
app.get('/cookie', function(req, res){
    res.send("<div><h1>Quiero una Cookie!</h1>\
    <p>To use this site you must accept these cookies!</p>\
    <p>Do you want them? They're free.</p>\
    <form action='' method='POST'><input type='radio' name ='cookieApproval' value='approved' checked='checked'>Please!<br>\
    <input type='radio' name='cookieApproval' value='rejected'>No, I'm a masochist.<br>\
    <input type='submit' value='My decision is final!'></form>\
    </div>");
});
app.post('/cookie', function(req, res){
    var approval = req.body.cookieApproval;
    if (approval == "approved") {
        res.cookie("portfolio", "approved");
        res.redirect(url);
    } else {
        console.log("not approved");
        res.send("<div><h1>More for me.</h1></div>");
    }
});
app.get('*', function(req, res, next){
    var cookie = req.cookies.portfolio;
    if (cookie == "approved"){
        next();
    } else {
        url = req.url;
        res.redirect('/cookie');
    }
});

var projectsURL = path.join(__dirname, 'Projects');
var projectsAvailable = fs.readdirSync(projectsURL);
var projects = [];
projectsAvailable.filter(function(file){
    return file[0] != ".";
}).filter(function(file){
    return path.extname(file) == '';
}).forEach(function(projectDir){
    var projectName = projectDir.replace(/-/g, " ");
    var project = {
        "name": projectName,
        "screenshot": ('/'+projectDir+'/screenshot.jpg'),
        "link": ('/projects/'+projectDir+'/description')
    };
    projects.push(project);
});
app.use(express.static(projectsURL));

app.get('/', function(req, res){
    res.redirect('/projects');
});
app.get('/projects', function(req, res){
    res.render('projects', {
        "css": "/home.css",
        "projects": projects,
        layout: 'layout'
    });
});
var urlofquery;
function checkExistence(req, res, next){
    var base = path.basename(req.url);
    if (base == "description") {
        urlofquery = path.join(__dirname, path.dirname(req.url));
        console.log(urlofquery);
    } else {
        urlofquery = path.join(projectsURL, base);
    }
    fs.exists(urlofquery, function(exists){
        if (!exists) {
            res.send("<p>Project Not Found</p>\
            <a href='/projects'>Go back list of available projects.</a>");
        } else {
            next();
        }
    });
}
app.get('/projects/*/description', checkExistence, function(req, res){
    var project = path.basename(urlofquery);
    const description = require(urlofquery+'/description.json');
    console.log(description);
    res.render('projects', {
        "css": "/description.css",
        "projects": projects,
        "description": description,
        "screenshot": ('/'+project+'/screenshot.jpg'),
        "projectHTML": ('/'+project+'/'+project+'.html'),
        layout: 'layout'
    });
});

app.listen(8080);

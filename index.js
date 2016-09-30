const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
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

app.use(express.static(path.join(__dirname, 'Projects')));
app.get('/', function(req, res){
    console.log('home');
    res.send("<div><h1>Hello World!</h1></div>");
});

app.listen(8080);

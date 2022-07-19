// App.js

/*
    SETUP
*/
var express = require("express");
var app = express();
var handlebars = require("express-handlebars").create({defaultLayout: "main"});
const cors = require('cors');

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("port", 3029);
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/images'));
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/fonts'));
app.use(express.static(__dirname + '/vendor'));

app.get('/',function(req,res){
  res.render('home.handlebars') 
});

app.get('/about',function(req,res){
  res.render('about.handlebars', {userDisease: JSON.stringify(req.query.disease), userStay: JSON.stringify(req.query.stay)}) 
});

app.get('/contact',function(req,res){
  res.render('contact.handlebars') 
});

app.get('/login',function(req,res){
  res.render('login.handlebars') 
});

app.get('/signup',function(req,res){
  res.render('signup.handlebars') 
});


app.listen(app.get('port'), function(){
	console.log('Express started on port ' + app.get('port') + '; press Ctrl-C to terminate.');
});

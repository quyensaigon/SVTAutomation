/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
//qvtran

var bodyParser = require('body-parser');
var multer = require('multer');
var request = require('request');
var methodOverride = require('method-override');
var morgan = require('morgan');
var unirest = require('unirest');
var mysql = require('mysql');
var control = require('./control');



//end qvtran
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();


// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
//qvtran
app.use(bodyParser());
//app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(morgan('dev'));



//end qvtran


// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
var server = app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
  
});

server.timeout = 600000;




//process requests
app.get('/test', function (req, res) {
   res.send('Hello World');
});

app.get('/showtabs', function (req, res) {
	   //debugger;
	   control.showtabs(mysql,req,res);
	});


app.get('/get_setup_info', function (req, res) {
	   //debugger;
	   project_id = req.query.project_id; 
	   control.get_setup_info(mysql,project_id,req,res);
	});


app.get('/get_test_summary', function (req, res) {
	   //debugger;
	   setup_id = req.query.setup_id; 
	   control.get_test_summary(mysql,setup_id,req,res);
	});

app.get('/get_result_details', function (req, res) {
	   //debugger;
	   test_date = req.query.test_date; 
	   control.get_result_details(mysql,test_date,req,res);
	});

app.post('/process_login', function(req,res) {
	//response = {
	//	user_name:req.body.username,
	//	password:req.body.password
	//};
	//console.log(response);
	//res.end(JSON.stringify(response));
	
	var username = req.body.username;
	var password = req.body.password;
	//res.send('Hello '+username);
	
	//control.loginEx(mysql,req,res,username,password); 
	
	control.login(mysql,req,res,username,password);
	
	
});



require('dotenv').config();
var express    = require('express');
var app 	   = express();
var server     = require('http').createServer(app);
var path 	   = require('path');
var session    = require('express-session');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var https      = require('https');


require('./db/db');
// mongoimport --db greenrun --collection mountains mountain.json --jsonArray
//import in the directory file is in

app.use(bodyParser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(session({
	secret: "I'm not a businessman, I'm a business, man.",
	resave: false,
	saveUninitialized: true,
	cookie: {secure: false}
}));


app.use(express.static(path.join(__dirname, 'public')));

var userController = require('./controllers/UserController');
var homeController = require('./controllers/HomeController');
var profileController = require('./controllers/ProfileController');

var weather = require('./utilities/weatherapi')


app.use('/user', userController);
app.use('/home', homeController);
app.use('/profile', profileController);



server.listen(3000, function(){
	console.log("yo it's Andre port 3000");
})
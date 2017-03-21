var express  = require('express');
var router 	 = express.Router();
var mountain = require('../models/Mountain.js');
var User 	 = require('../models/User');
var mongoose = require('mongoose');
var weather  = require('../utilities/weatherapi.js');


router.get('/', function(req, res){

	
	if(req.session.isLoggedIn){

		var userId = req.session.userId;
		console.log(req.session.userId)
		User.findById(userId).populate('favoriteMountain').exec(function(err, user){
				var emptyMountain
					console.log(user.favoriteMountain.length, ' this is length')
				
				if (user.favoriteMountain.length === 0){
					// console.log(' this is hitting')
					emptyMountain = true; 
					res.render('profile', {username: req.session.username, emptyMountain: emptyMountain});
				}
				else{
					console.log('this is hitting')
					emptyMountain = false; 
					weather.get(user.favoriteMountain, function(favoriteMountainArray){
						console.log(favoriteMountainArray, ' this fav mount')
						res.render('profile', {username: req.session.username, favoriteMountainArray: favoriteMountainArray, emptyMountain: emptyMountain});
						// res.send(apiWeather);
					});

				}

		

		});

	}

		// , current: weather.currently.summary, temp: weather.currently.temperature, icon: weather.currently.icon }
	else {
		res.redirect('/user/start');
	}
});

//this is on profile page and should be able to but it render into a hbs
router.post('/', function(req,res){

	var mountainId = req.body.mountainId
	var mountain =	mountainId
	//this tells us if the Mountain Id we are grabbing is mongoose
	console.log(mongoose.Types.ObjectId.isValid(mountainId), ' this is mid');
	
	console.log(req.body, ' this is post route for id');
	var userId = req.session.userId
	User.findById(userId, function(err, users){

		// console.log(userId);
		// console.log(users.favoriteMountain, ' this is user mountain')
	

		users.favoriteMountain.push(mountain);
		// console.log(users.favoriteMountain.length, ' this is fav mountain length')
		users.save();
		res.render('profile', {favoriteMountain: []});
		
	});
});


router.delete('/:id', function(req, res){
	var id = req.params.id;
	console.log(id + " this is the id");
	var userId = req.session.userId;
	User.findById(userId, function(err, user){
		console.log(userId + " this is USERID");
	user.favoriteMountain.pull(id);
	// console.log(user.favoriteMountain.length)
	// console.log(user, ' this is user in delete')
	user.save();
	console.log(user);
	res.send('success');
	});

});


module.exports = router;


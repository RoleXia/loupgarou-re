var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	mongoose = require('mongoose'),
	async = require('async'),
	games = require('../models/game.js'),
	users = require('../models/user.js'),
	bodyParser = require('body-parser');
require('../config/passport')(passport);


router.use(function isLoggedIn(req, res, next) {
	var regex = new RegExp('^\/static\/');
	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated() || regex.exec(req.url) != null)
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
});

router.use(function (req, res, next) {
	req.locals = {};
	req.locals.isLogged = req.isAuthenticated();
	// log each request to the console
	console.log("GAMES : ", req.method, req.url);

	// continue doing what we were doing and go to the route
	next();
});

router.get('/', function (req, res) {
	req.myGames = [];
	req.otherGames = [];
	games.find({
		$or : [{
			users : {
				$elemMatch : {
					id : req.user._id
				}
			}
		},{
			status : "En attente"
		}]
	}).exec(function (err, gamesList) {
		async.each(gamesList, function(game,callback){
			console.log(game);
			userIsIn = false;
			game.users.forEach(function(user){
				if(user.id = req.user._id){
					userIsIn = true;
				}
			});
			if(userIsIn){
				req.myGames.push(game);
			}else{
				req.otherGames.push(game);
			}
			callback();
		}, function(err){
			if(!err){
				console.log("req.games = " + req.games);
				res.render('lobby.twig', {
					message: "Vous êtes à l'index du jeu.",
					list_myGames: req.myGames,
					list_otherGames : req.otherGames
				});
			}
		});
	});
});

router.post('/new', function (req, res) {
	console.log(req.body);
	res.render('create_new_game.twig', {
		user: req.user,
		body: req.body
	});
});

router.post('/validation', function (req, res) {
	var temps = {
		status: "En attente",
		nb_joueurs: parseInt(req.body.nb_joueurs_game),
		password: req.body.password,
		nb_joueurs_en_vie: parseInt(req.body.nb_joueurs_game),
		nb_tours: 0,
		name: req.body.game_name,
		users : [{
			id : req.user._id,
			role : "undefined",
			alive : true
		}]
	};
	var re = new RegExp('^nb_((?!joueurs_game).)*$');
	for (var i in req.body) {
		var name = i.match(re);
		if (name != null) {
			temps[i] = req.body[i];
		}
	}
	var game = new games(temps);
	console.log(game);
	game.save();
	res.redirect('/games/');
});

module.exports = router;
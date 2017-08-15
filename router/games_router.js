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
			var userIsIn = false;
			var count = 0;
			game.users.forEach(function(user){
				count++;
				if(user.id.equals(req.user._id)){
					userIsIn = true;
				}
			});
			game.nb_joueurs_actuel = count;
			if(userIsIn){
				req.myGames.push(game);
			}else if(game.nb_joueurs!=game.nb_joueurs_actuel){	
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
router.get('/join/:game_id', function(req, res){
	var games_id = req.params.game_id;
	games.findOne({_id : games_id}, function(err,game){
		game.users.push({
			id : req.user._id,
			role : "undefined",
			alive : true
		});
		console.log(game);
		game.save();
		res.redirect('/games/');
	});
});
router.get('/:game_id',function(req,res){
	var games_id = req.params.game_id;
		games.findOne({_id : games_id}).populate('users.id').exec(function(err,game){
			game = game.toObject();
			if(game.status == "En attente"){
				var admin = req.user._id.toString() == game.users[0].id._id.toString();
				var roles = getRolesInGame(game);
				console.log(game);
				console.log(game.users[0]);
				res.render('waitingRoom.twig', {
					user: req.user,
					game : game,
					roles : roles,
					admin : admin
				});
			}
			else{
				res.render('game.twig', {
					user: req.user,
					game : game
				});
			}
	});
});

router.post('/attribute', function(req,res){
	game_id = req.body.game_id;
	games.findOne({_id : game_id}).populate('users.id').exec(function(err,gameBis){
		game = gameBis.toObject();
		var roles = getRolesInGame(game);
		var roleArray = [];
		for(role in roles){
			roleArray.push(role);
		}
		/*
		** Attribution du role aléatoirement
		*/
		for(player in game.users){
			random = getRandomInt(0,roleArray.length-1);
			game.users[player].role = roleArray[random];
			roleArray.splice(random,1);
		}
		gameBis.users = game.users;
		gameBis.status = "En jeu";
		gameBis.save(function(err,updatedGame){
			if (err) return handleError(err);
			res.send(updatedGame);
			res.redirect('/games/');
		});
	});
});

function getRolesInGame(game){
	var count = 0;
	var max = Object.keys(game).length;
	roles = {};
	for(var key in game){
		if(count<7){
			count++;
		}else if (count >= max-2){
			break;
		}else{
			roles[key.substr(3)] = game[key];
			count++;
		}
	}
	return roles;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = router;
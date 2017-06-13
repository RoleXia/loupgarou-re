var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    mongoose = require('mongoose'),
    games = require('../models/game.js'),
    users = require('../models/user.js'),
    bodyParser = require('body-parser'),
    peoples = require('../models/people.js');
    require('../config/passport')(passport);

router.use(function isLoggedIn(req, res, next) {
    var regex = new RegExp('^\/static\/');
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated() || regex.exec(req.url)!=null)
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
});

router.use(function(req, res, next) {
    req.locals = {};
    req.locals.isLogged = req.isAuthenticated();
    // log each request to the console
    console.log("GAMES : ", req.method, req.url);

    // continue doing what we were doing and go to the route
    next(); 
});

router.get('/', function(req, res){
  peoples.find({'id_user' : req.user._id}).exec(function(err, gamesid){
    console.log(err);
    gamesid.forEach(function(element) {
      req.games.push(element);
    }, this);
  });
  res.render('lobby.twig', {
    message : "Vous êtes à l'index du jeu.",
    list_games : req.games
  });
});

router.post('/new', function(req,res){
  console.log(req.body);
  res.render('create_new_game.twig', {
    user : req.user,
    body : req.body
  });
});

router.post('/validation', function(req,res){
  console.log(req.body);
  res.redirect('/');
});

module.exports = router;
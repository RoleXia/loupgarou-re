var express = require('express'),
    router = express.Router();

router.use(function(req, res, next) {

    // log each request to the console
    console.log("GAMES : ", req.method, req.url);

    // continue doing what we were doing and go to the route
    next(); 
});

router.get('/', function(req, res){
  res.render('index.twig', {
    message : "Vous êtes à l'index du jeu."
  });
});

router.get('/village', function(req, res){
  res.render('index.twig', {
    message : "Bienvenue dans le village péon."
  });
});

module.exports = router;
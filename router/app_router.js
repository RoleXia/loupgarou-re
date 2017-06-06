var express = require('express'),
    router = express.Router();

router.use(function(req, res, next) {

    // log each request to the console
    console.log("APP : ", req.method, req.url);

    // continue doing what we were doing and go to the route
    next(); 
});

router.get('/', function(req, res){
  res.render('index.twig', {
    message : "Vous êtes à l'index du site."
  });
});

router.get('/connexion', function(req, res){
  res.render('index.twig', {
    message : "Un jour vous pourrez vous connecter ici"
  });
});

module.exports = router;
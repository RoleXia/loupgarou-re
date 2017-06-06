var express = require('express'),
    router = express.Router(),
    passport = require('passport');
    require('../config/passport')(passport);

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

router.get('/login', function(req, res){
  res.render('login.twig', {
    message : req.flash('messageLogin')
  });
});

router.get('/signup', function(req, res){
  res.render('signup.twig', {
    message : req.flash('signupMessage')
  });
});

router.get('/profile', function(req, res){
  console.log(req.user);
  res.render('profile.twig', {
    message : "Un jour vous pourrez regarder votre profil ici",
    user : req.user
  });
});
router.get('/profile', function(req, res){
    req.logout();
    res.redirect('/');
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


module.exports = router;
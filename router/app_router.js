var express = require('express'),
    router = express.Router(),
    passport = require('passport');
    require('../config/passport')(passport);

router.use(function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.url == "/" || req.url == "/login" || req.url == "/signup" || req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
});

router.use(function(req, res, next) {
    req.locals = {};
    req.locals.isLogged = req.isAuthenticated();
    // log each request to the console
    console.log("APP : ", req.method, req.url);
    console.log("LOGGED : ", req.locals.isLogged);
    // continue doing what we were doing and go to the route
    next(); 
    //coucou
});

router.get('/', function(req, res){
  res.render('index.twig', {
    message : "Vous êtes à l'index du site.",
    locals : req.locals
  });
});

router.get('/login', function(req, res){
  res.render('login.twig', {
    message : req.flash('messageLogin'),
    locals : req.locals
  });
});

router.get('/signup', function(req, res){
  res.render('signup.twig', {
    message : req.flash('signupMessage'),
    locals : req.locals
  });
});

router.get('/profile', function(req, res){
  console.log(req.user);
  res.render('profile.twig', {
    message : "Un jour vous pourrez regarder votre profil ici",
    user : req.user,
    locals : req.locals
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


module.exports = router;
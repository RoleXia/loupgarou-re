var twig = require("twig"),
    express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session');

mongoose.connect('mongodb://localhost/exiagarou');

require('./config/passport')(passport);
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({ secret: 'ILostTheGame' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected at mongodb");
});

app.use('/static', express.static('./public'));
var games_router = require('./router/games_router.js');
var app_router = require('./router/app_router.js');
app.use('/games', games_router);
app.use('/', app_router);



app.listen(8080);
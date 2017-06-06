var twig = require("twig"),
    express = require('express'),
    app = express(),
    mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/exiagarou');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected at mongodb");
});


var games_router = require('./router/games_router.js');
var app_router = require('./router/app_router.js');
app.use('/games', games_router);
app.use('/', app_router);

app.listen(8080);
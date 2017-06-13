// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var gameSchema = mongoose.Schema({
        status              : String,
        nb_joueurs          : Number,
        nb_tours            : Number,
        nb_joueurs_en_vie   : Number 
});

module.exports = mongoose.model('Game', gameSchema);
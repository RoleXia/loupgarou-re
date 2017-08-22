// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var gameSchema = mongoose.Schema({
        status              : String,
        password            : String,
        nb_joueurs          : Number,
        nb_tours            : Number,
        nb_joueurs_en_vie   : Number,
        name                : String,
        users               : [{
                id : {type : mongoose.Schema.Types.ObjectId, ref: 'User'},
                role : String,
                alive : Boolean,
                vote : String
        }]
}, { strict : false});

module.exports = mongoose.model('Game', gameSchema);
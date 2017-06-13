// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var peopleSchema = mongoose.Schema({
        id_game     : { type : mongoose.Schema.Types.ObjectId, ref: 'Game'},
        id_user     : { type : mongoose.Schema.Types.ObjectId, ref: 'User'},
        role        : { type : String , unique : true, required : true, dropDups: true },
        status      : { type : String , unique : false, required : true, dropDups: false }
});

module.exports = mongoose.model('Peoples', peopleSchema);
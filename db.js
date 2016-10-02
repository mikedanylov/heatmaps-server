/**
 * Created by mikedanylov on 10/1/16.
 */
var config = require('./config'); 

var uri = process.env.MONGOLAB_URI || config.mongoUri;

var mongoose = require('mongoose');

mongoose.connect(uri);

var db = mongoose.connection;

db.on('error', function (err) {
    console.log('Failed to connect to mongodb', err);
});

db.once('open', function (resp) {
    console.log('Connected to mongodb, uri: ' + uri);
});

var eventSchema = mongoose.Schema({
    url         : String,
    type        : String,
    x           : Number,
    y           : Number,
    selector    : String,
    timestamp   : Date,
    platform    : String
});

var mapSchema = mongoose.Schema({
    url: String,
    platform: String,
    type: String,
    time_start: Date,
    time_end: Date
});

exports.Event = mongoose.model('Event', eventSchema);
exports.Map = mongoose.model('Map', mapSchema);

/**
 * Created by mikedanylov on 10/1/16.
 */

var uri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/heatmaps-server-db';

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
    viewUrl     : String,
    type        : String,
    origX       : Number,
    origY       : Number,
    scaledX     : Number,
    scaledY     : Number,
    selector    : String,
    timestamp   : Date,
    width       : Number,
    height      : Number,
    platform    : String
});

exports.Event = mongoose.model('Event', eventSchema);

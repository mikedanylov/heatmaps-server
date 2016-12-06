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
    viewUrl      : String,
    type         : String,
    origX        : Number,
    origY        : Number,
    scaledX      : Number,
    scaledY      : Number,
    selector     : String,
    timestamp    : Date,
    width        : Number,
    height       : Number,
    platform     : String,
    modifications: [String]
});

var Event = mongoose.model('Event', eventSchema);

Event.statics.findEvents = function (queryParams, remove, cb) {
    return this.find({
        type        : queryParams.type,
        platform    : queryParams.platform,
        viewUrl     : queryParams.url,
        $and        : [
            { timestamp: { $gt: startTime } },
            { timestamp: { $lt: endTime } }
        ]
    }, remove).exec(cb);
};

Event.statics.findEventsWithModifications = function (queryParams, remove, cb) {
    this.find({
        type        : queryParams.type,
        platform    : queryParams.platform,
        viewUrl     : queryParams.url,
        $and        : [
            { timestamp: { $gt: startTime } },
            { timestamp: { $lt: endTime } }
        ],
        modifications: {$all: queryParams.modifications}
    }, remove).exec(cb);
};

Event.statics.findEventsWithModificationsExclusive = function (queryParams, remove, cb) {
    this.find({
        type        : queryParams.type,
        platform    : queryParams.platform,
        viewUrl     : queryParams.url,
        $and        : [
            { timestamp: { $gt: queryParams.startTime } },
            { timestamp: { $lt: queryParams.endTime } },
            {modifications: {$all: queryParams.modifications}},
            {modifications: {$size: queryParams.modifications.length}}
        ]
    }, remove).exec(cb);
};

exports.Event = Event;


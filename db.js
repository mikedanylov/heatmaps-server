/**
 * Created by mikedanylov on 10/1/16.
 */

var uri;
if (app.get('env') === 'development') {
    uri = 'mongodb://localhost:27017/heatmaps-server';
} else {
    uri = process.ENV.MONGOLAB_URI;
}

var mongoose = require('mongoose');

mongoose.connect(uri);

var db = mongoose.connection;

db.on('error', function (err) {
    console.log('Failed to connect to mongodb', err);
});

db.once('open', function (resp) {
    console.log('Connected to mongodb');
});

var eventSchema = mongoose.Schema({
    view: {
        url: String
    },
    type: String,
    events: [
        {
            x: Number,
            y: Number,
            element: {
                selector: String
            },
            time: {
                timestamp: Date
            }
        }
    ],
    resolution: {
        width: Number,
        height: Number
    }
});

var mapSchema = mongoose.Schema({
    view: {
        url: String
    },
    platform: String,
    type: String,
    time: {
        start: Date,
        end: Date
    }
});

exports.Event = mongoose.model('Event', eventSchema);
exports.Map = mongoose.model('Map', mapSchema);

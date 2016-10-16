/**
 * Created by mikedanylov on 10/1/16.
 */

var router = require('express').Router();
var screen = require('./_helpers').Screen;
var createError = require('../error').createError;
var Event = require('../db').Event;

router.post('/', function(req, res, next) {
    var events = [];
    var params;
    var err = new Error();

    err.status = 400;
    err.message = 'Bad Request';

    // simple validation in order to save db from garbage
    if (!req || !req.body) {
        res.status(err.status);
        res.send(createError(err, 'POST /events: Request body is empty'));
        return;
    }

    params = req.body;
    if (!params.view || !params.type || !params.events || !params.events.length) {
        res.status(err.status);
        res.send(createError(err, 'POST /events: Parameters are not correct'));
        return;
    }

    // create a new event entry in db for each event object from request
    params.events.forEach(function (event) {
        var platform = screen.getPlatform(event.width);
        var date = parseInt(event.timestamp) || event.timestamp;

        events.push({
            viewUrl     : params.view,
            type        : params.type,
            origX       : parseInt(event.x), // screen.getPosition(event.x, event.width),
            origY       : parseInt(event.y),
            scaledX     : screen.getPosition(event.x, event.width),
            scaledY     : parseInt(event.y),
            selector    : event.selector,
            timestamp   : new Date(date),
            platform    : platform.name,
            width       : event.width,
            height      : event.height
        });
    });

    Event.collection.insert(events, function (err, objects) {
        if (err) {
            console.log('POST /events: Failed to save event', err);
            res.status(err.status);
            res.send(createError(err, 'POST /events: Failed to save to db'));
            return;
        }

        console.log('POST /events: Saved ' + events.length + ' new Events', objects);
        res.send({
            success     : true,
            timestamp   : new Date().getTime(),
            info        : 'POST /events: Saved ' + events.length + ' new Events',
            events      : objects // for development only
        });
    });
});

router.get('/', function(req, res, next) {
    var params;
    var err = new Error();
    var query;
    var remove;

    err.status = 400;
    err.message = 'Bad Request';

    // simple validation in order to save db from garbage
    if (!req || !req.query) {
        res.status(err.status);
        res.send(createError(err, 'GET /events: No query params'));
        return;
    }

    params = req.query;
    if (!params.url || !params.type || !params.platform ||
            !params.start || !params.end) {

        res.status(err.status);
        res.send(createError(err, 'GET /events: Invalid query params'));
        return;
    }

    var startTime = new Date(parseInt(params.start));
    var endTime = new Date(parseInt(params.end));

    query = {
        type        : params.type,
        platform    : params.platform,
        viewUrl     : params.url,
        $and        : [
            { timestamp: { $gt: startTime } },
            { timestamp: { $lt: endTime } }
        ]
    };

    remove = {
        _id         : 0,
        type        : 0,
        viewUrl     : 0,
        platform    : 0,
        timestamp   : 0,
        width       : 0,
        height      : 0
    };

    Event.find(query, remove, function (err, objects) {
        if (err) {
            console.log('GET /events: Failed to find Events', err);
            res.status(err.status);
            res.send(createError(err, 'GET /events: Failed to find Events'));
            return;
        }

        console.log('GET /events: Query was successful', objects);
        res.send({
            success     : true,
            timestamp   : new Date().getTime(),
            events      : objects
        });
    });
});

module.exports = router;

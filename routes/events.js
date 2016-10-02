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
    if (!params.view.url || !params.type || !params.resolution ||
        !params.events || !params.events.length) {
        res.status(err.status);
        res.send(createError(err, 'POST /events: Parameters are not correct'));
        return;
    }

    // create a new event entry in db for each event object from request
    params.events.forEach(function (event) {
        var platform = screen.getPlatform(params.resolution.width);

        events.push({
            url         : params.view.url,
            type        : params.type,
            x           : screen.getPosition(event.x, params.resolution.width),
            y           : parseInt(event.y),
            selector    : event.element.selector,
            timestamp   : new Date(new Date(event.time.timestamp).toISOString()),
            platform    : platform.name
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
            status  : 'success',
            info    : 'POST /events: Saved ' + events.length + ' new Events',
            events  : objects
        });
    });
});

module.exports = router;

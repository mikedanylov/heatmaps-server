/**
 * Created by mikedanylov on 10/1/16.
 */

var router = require('express').Router();

var helpers = require('./_helpers');
var createError = require('../error').createError;
var Event = require('../db').Event;

router.get('/', function(req, res, next) {
    res.send(createError({
        status  : 404,
        message : 'Not Found'
    }, 'Use POST /events'));
});

router.post('/', function(req, res, next) {
    var events = [];
    var params;

    // simple validation in order to save db from garbage
    if (!req || !req.body) {
        res.send(createError({
            status  : 400,
            message : 'Bad Request'
        }, 'Use POST /events'));
    }

    params = req.body;
    if (!params.view.url || !params.type || !params.resolution ||
        !params.events || !params.events.length) {
        res.send(createError({
            status  : 400,
            message : 'Bad Request'
        }, 'POST /events: Parameters are not correct'));
    }

    // create a new event entry in db for each event object from request
    params.events.forEach(function (event) {
        var platform = helpers.getPlatform(params.resolution.width);

        events.push({
            url: params.view.url,
            type: params.type,
            x: helpers.getPosition(event.x, params.resolution.width),
            y: parseInt(event.y),
            selector: event.element.selector,
            timestamp: event.time.timestamp,
            platform: platform.name
        });
    });


    Event.collection.insert(events, function (err, objects) {
        if (err) {
            console.log('POST /events: Failed to save event', err);
            res.send(createError({
                status  : 400,
                message : 'Bad Request'
            }, 'POST /events: Failed to save to db'));
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

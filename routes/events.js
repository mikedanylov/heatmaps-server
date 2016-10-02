/**
 * Created by mikedanylov on 10/1/16.
 */

var router = require('express').Router();

var helpers = require('./_helpers');
var createError = require('../error').createError;
var Event = require('../db').Event;

router.all('/', function(req, res, next) {
    res.send(createError({
        status  : 404,
        message : 'Not Found'
    }, 'Use POST /api/event'));
});

router.get('/', function(req, res, next) {
});

router.post('/', function(req, res, next) {
    var events = [];
    var params;

    // simple validation in order to save db from garbage
    if (!req || !req.body) {
        res.send(createError({
            status  : 400,
            message : 'Bad Request'
        }, 'Use POST /api/event'));
    }

    params = req.body;
    if (!params.view.url || !params.type || !params.resolution ||
        !params.events || !params.events.length) {
        res.send(createError({
            status  : 400,
            message : 'Bad Request'
        }, 'POST /api/event: Parameters are not correct'));
    }

    // create a new event entry in db for each event object from request
    params.events.forEach(function (event) {
        var platform = helpers.getPlatform(params.resolution.width);

        events.push({
            url: params.view.url,
            type: params.type,
            x: helpers.getPosition(event.x, params.resolution.width),
            y: event.y,
            selector: event.element.selector,
            timestamp: event.time.timestamp,
            platform: platform.name
        });
    });


    Event.collection.insert(events, function (err, objects) {
        if (err) {
            console.log('POST /api/event: Failed to save event', err);
            res.send(createError({
                status  : 400,
                message : 'Bad Request'
            }, 'POST /api/event: Failed to save to db'));
        }

        console.log('POST /api/event: ' + events.length + ' new Event is saved', objects);
        res.send({
            status  : 'success',
            info    : 'POST /api/event: ' + events.length + ' new Events are saved',
            events  : objects
        });
    });
});

module.exports = router;

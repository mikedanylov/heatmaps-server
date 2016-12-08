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
    if (!params.view || !params.type || !params.width ||
        !params.height || !params.events || !params.events.length) {
        res.status(err.status);
        res.send(createError(err, 'POST /events: Parameters are not correct'));
        return;
    }

    // create a new event entry in db for each event object from request
    params.events.forEach(function (event) {
        var platform = screen.getPlatform(params.width);

        events.push({
            viewUrl      : params.view,
            type         : params.type,
            origX        : parseInt(event.x), // screen.getPosition(event.x, event.width),
            origY        : parseInt(event.y),
            scaledX      : screen.getPosition(event.x, params.width),
            scaledY      : parseInt(event.y),
            selector     : event.selector,
            timestamp    : new Date(event.timestamp),
            platform     : platform.name,
            width        : params.width,
            height       : params.height,
            modifications: params.modifications ? params.modifications : []
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

    var startTime;
    var endTime;
    if (/^\d{4}\-\d{2}\-\d{2}$/.test(params.start) &&
        /^\d{4}\-\d{2}\-\d{2}$/.test(params.end)) {
        startTime = new Date(params.start);
        endTime = new Date(params.end);
    } else {
        startTime = new Date(parseInt(params.start));
        endTime = new Date(parseInt(params.end));
    }

    queryParams = {
        type         : params.type,
        platform     : params.platform,
        url          : params.url,
        startTime    : startTime,
        endTime      : endTime,
        modifications: params.modifications ? JSON.parse(params.modifications) : null
    };

    remove = {
        _id         : 0,
        type        : 0,
        viewUrl     : 0,
        timestamp   : 0,
        width       : 0,
        height      : 0
    };

    if (!params.modifications) {
        Event.findEvents(queryParams, remove, responseCb);
    } else if (params.modificationsExclusive === 'true') {
        Event.findEventsWithModificationsExclusive(queryParams, remove, responseCb);
    } else {
        Event.findEventsWithModifications(queryParams, remove, responseCb);
    }

    function responseCb (err, objects) {
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
    }
});

module.exports = router;

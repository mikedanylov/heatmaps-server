/**
 * Created by mikedanylov on 10/1/16.
 */

var express = require('express');
var router = express.Router();
var Event = require('../db').Event;
var Map = require('../db').Map;

router.get('/', function(req, res, next) {
    res.send({ status: 'success' });
});

router.post('/event', function(req, res, next) {

    // simple validation in order to save db from garbage
    if (!req || !req.body) {
        res.send({
            status: 'error',
            error: {
                status: 400
            },
            message: 'Bad Request',
            info: 'POST api/event: No request body'
        });
    }

    if (!req.body.view.url || !req.body.type || !req.body.resolution ||
        !req.body.events || !req.body.events.length) {

        res.send({
            status: 'error',
            error: {
                status: 400
            },
            message: 'Bad Request',
            info: 'POST /api/event: Parameters are not correct'
        });
    }

    var newEvent = new Event(req.body);

    newEvent.save(function (err, savedEvent) {
        if (err) {
            console.log('POST /api/event: Failed to save event');
            res.send({
                status: 'error',
                action: 'failed to save event'
            });
        }

        console.log('POST /api/event: new Event is saved');
        res.send({
            status: 'success',
            event: newEvent
        });
    });
});

router.post('/map', function(req, res, next) {
    res.send({ status: 'success' });
});

module.exports = router;

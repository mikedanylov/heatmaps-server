/**
 * Created by mikedanylov on 10/2/16.
 */

var router = require('express').Router();
var createError = require('../error').createError;
var Event = require('../db').Event;

router.post('/', function(req, res, next) {
    var params;
    var err = new Error();
    var query;
    var remove;

    err.status = 400;
    err.message = 'Bad Request';

    // simple validation in order to save db from garbage
    if (!req || !req.body) {
        res.status(err.status);
        res.send(createError(err, 'POST /data: Request body is empty'));
        return;
    }

    params = req.body;
    if (!params.type || !params.platform || !params.view ||
        !params.view.url || !params.time || !params.time.start || !params.time.end) {

        res.status(err.status);
        res.send(createError(err, 'POST /data: Parameters are not correct'));
        return;
    }

    query = {
        type        : params.type,
        platform    : params.platform,
        url         : params.view.url,
        $and        : [
            { timestamp: { $gt: new Date(params.time.start).toISOString() } },
            { timestamp: { $lt: new Date(params.time.end).toISOString() } }
        ]
    };

    remove = {
        _id         : 0,
        type        : 0,
        url         : 0,
        platform    : 0
    };

    Event.find(query, remove, function (err, objects) {
        if (err) {
            console.log('POST /data: Failed to find Events', err);
            res.status(err.status);
            res.send(createError(err, 'POST /data: Failed to find Events'));
            return;
        }

        console.log('POST /data: Query was successful', objects);
        res.send({
            status  : 'success',
            events  : objects
        });
    });
});

module.exports = router;

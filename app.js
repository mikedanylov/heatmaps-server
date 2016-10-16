var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var events = require('./routes/events');
var createError = require('./error').createError;

var app = express();
var cors = require('cors');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// enable CORS
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use(cors());


app.use('/', routes);
app.use('/events', events);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
if (app.get('env') === 'development') {
    // development error handler
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            success : false,
            error   : {
                status  : err.status,
                message : err.message
            }
        });
    });
} else {
    // production error handler
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            success : false,
            error   : {
                status  : err.status,
                message : err.message
            }
        });
    });
}

module.exports = app;

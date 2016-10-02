var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var api = require('./routes/api');
var createError = require('./error').createError;

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var Event = require('./db').Event;
var Map = require('./db').Map;

app.use('/', routes);
app.use('/api', api);

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
        res.send(createError(err));
    });
} else {
    // production error handler
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send(createError(err));
    });
}

module.exports = app;

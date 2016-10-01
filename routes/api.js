/**
 * Created by mikedanylov on 10/1/16.
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send({ status: 'success' });
});

module.exports = router;

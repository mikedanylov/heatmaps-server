var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var randWidth = Math.floor(Math.random() * 1920);
    var randHeight = Math.floor(Math.random() * 1080);
    var timestamp = new Date().getTime();

    res.send({
        status: 'success',
        heatmap_server: [
            {
                path: '/events',
                POST: {
                    url     : 'https://keybar.herokuapp.com/songs',
                    type    : 'click',
                    width   : randWidth,
                    height  : randHeight,
                    events  : [
                        {
                            x           : Math.floor(Math.random() * randHeight),
                            y           : Math.floor(Math.random() * randWidth),
                            selector    : 'body > div.container .very-impornant-button',
                            timestamp   : timestamp + 1111
                        },
                        {
                            x           : Math.floor(Math.random() * randHeight),
                            y           : Math.floor(Math.random() * randWidth),
                            selector    : 'body > div.container .header',
                            timestamp   : timestamp + 2222
                        },
                        {
                            x           : Math.floor(Math.random() * randHeight),
                            y           : Math.floor(Math.random() * randWidth),
                            selector    : 'body > div.footer a.aboutus',
                            timestamp   : timestamp + 3333
                        }
                    ]
                },
                GET: {
                    url         : 'https://keybar.herokuapp.com/songs',
                    platform    : 'desktop|tablet|mobile',
                    type        : 'click',
                    start       : timestamp - 1234567,
                    end         : timestamp + 1234567
                }
            }
        ]
    });
});

module.exports = router;

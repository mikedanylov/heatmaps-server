var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var randWidth = Math.floor(Math.random() * 1920);
    var randHeight = Math.floor(Math.random() * 1080);
    var timestamp = new Date().getTime();

    res.send({
        status: 'success',
        heatmap_server: {
            path: '/api',
            POST: {
                view: {
                    url: 'https://keybar.herokuapp.com/songs'
                },
                type: 'click',
                events: [
                    {
                        x: Math.floor(Math.random() * randHeight),
                        y: Math.floor(Math.random() * randWidth),
                        element: {
                            selector: 'body > div.container .very-impornant-button'
                        },
                        time: {
                            timestamp: timestamp + 1111
                        }
                    },
                    {
                        x: Math.floor(Math.random() * randHeight),
                        y: Math.floor(Math.random() * randWidth),
                        element: {
                            selector: 'body > div.container .header'
                        },
                        time: {
                            timestamp: timestamp + 2222
                        }
                    },
                    {
                        x: Math.floor(Math.random() * randHeight),
                        y: Math.floor(Math.random() * randWidth),
                        element: {
                            selector: 'body > div.footer a.aboutus'
                        },
                        time: {
                            timestamp: timestamp + 3333
                        }
                    }
                ],
                resolution: {
                    width: randWidth,
                    height: randHeight
                }
            },
            GET: {
                view: {
                    url: 'https://keybar.herokuapp.com/songs'
                },
                platform: 'desktop|tablet|mobile',
                type: 'click',
                time: {
                    start: timestamp - 1234567,
                    end: timestamp + 1234567
                }
            }
        }
    });
});

module.exports = router;

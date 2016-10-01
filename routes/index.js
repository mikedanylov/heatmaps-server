var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var randWidth = Math.floor(Math.random() * 1920);
    var randHeight = Math.floor(Math.random() * 1080);

    res.send({
        status: 'success',
        heatmap_server: {
            path: '/api',
            POST: {
                view: {
                    url: 'https://keybar.herokuapp.com/songs'
                },
                click: {
                    x: Math.floor(Math.random() * randHeight),
                    y: Math.floor(Math.random() * randWidth)
                },
                resolution: {
                    width: randWidth,
                    height: randHeight
                },
                element: {
                    selector: 'body > div.container .very-impornant-button'
                },
                time: {
                    timestamp: new Date().getTime()
                }
            },
            GET: {
                view: {
                    url: 'https://keybar.herokuapp.com/songs'
                },
                platform: 'desktop|tablet|mobile',
                type: 'click',
                time: {
                    start: new Date().getTime() - 1234567,
                    end: new Date().getTime()
                }
            }
        }
    });
});

module.exports = router;

/**
 * Created by mikedanylov on 10/2/16.
 */
"use strict";
var Screen = (function () {
    function Screen() {
    }
    /**
     * @desc    Recalculate coordinate and map to standard resolution
     */
    Screen.getPosition = function (coordinate, max) {
        var platform;
        var factor;
        if (coordinate < 0 || !max) {
            throw new Error('api.getPosition: No params');
        }
        platform = this.getPlatform(max);
        factor = platform.width / max;
        return Math.floor(coordinate * factor);
    };
    /**
     * @desc    Get standard platform for current screen width
     */
    Screen.getPlatform = function (width) {
        var result;
        var platforms = [
            new Platform('desktop', 1920),
            new Platform('tablet', 1024),
            new Platform('mobile', 600)
        ];
        if (!width) {
            throw new Error('api.getPlatform: No params');
        }
        result = platforms[0];
        platforms.forEach(function (platform) {
            if (platform.width > width) {
                result = platform;
            }
        });
        return result;
    };
    return Screen;
}());
exports.Screen = Screen;
var Platform = (function () {
    function Platform(name, width) {
        this._name = name;
        this._width = width;
    }
    Object.defineProperty(Platform.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Platform.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (value) {
            this._width = value;
        },
        enumerable: true,
        configurable: true
    });
    return Platform;
}());
exports.Platform = Platform;

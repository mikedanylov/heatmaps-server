/**
 * Created by mikedanylov on 10/2/16.
 */
"use strict";
var Helper = (function () {
    function Helper() {
    }
    /**
     * @desc                        Recalculate coordinate and map to standard resolution
     * @param   {number} coordinate
     * @param   {number} max
     * @returns {number}            New coordinate relative to standard screen width
     */
    Helper.prototype.getPosition = function (coordinate, max) {
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
     * @desc                        Get standard platform for current screen width
     * @param   {number}    width   Current screen width
     * @returns {object}            Platform object
     */
    Helper.prototype.getPlatform = function (width) {
        var result;
        var platforms = [
            new Platform('mobile', 320),
            new Platform('tablet', 600),
            new Platform('desktop', 1024)
        ];
        if (!width) {
            throw new Error('api.getPlatform: No params');
        }
        result = platforms[0];
        platforms.forEach(function (platform) {
            if (platform.width < width) {
                result = platform;
            }
        });
        return result;
    };
    return Helper;
}());
exports.Helper = Helper;
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

/**
 * Created by mikedanylov on 10/2/16.
 */

module.exports = {
    getPosition     : getPosition,
    getPlatform     : getPlatform
};

/**
 * @desc                        Recalculate coordinate and map to standard resolution
 * @param   {number} coordinate
 * @param   {number} max
 * @returns {number}            New coordinate relative to standard screen width
 */
function getPosition (coordinate, max) {
    var platform;
    var factor;

    if ((!coordinate && coordinate < 0) || !max) {
        throw new Error('api.getPosition: No params');
    }

    platform = getPlatform(max);
    factor = platform.width / max;

    return coordinate * factor;
}

/**
 * @desc                        Get standard platform for current screen width
 * @param   {number}    width   Current screen width
 * @returns {object}            Platform object
 */
function getPlatform (width) {
    var result;
    var platforms = [
        {
            name    : 'mobile',
            width   : 320
        },
        {
            name    : 'tablet',
            width   : 600
        },
        {
            name    : 'desktop',
            width   : 1024
        }
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
}

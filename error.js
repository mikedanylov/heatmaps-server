/**
 * Created by mikedanylov on 10/2/16.
 */

function createError (err, info) {
    var errObj = {};

    if (!err || !err.message || !err.status) {
        return {status: 'error'};
    }

    errObj = {
        status: 'error',
        error: err
    };

    if (info) {
        errObj.info = info;
    }

    return errObj;
}

module.exports.createError = createError;

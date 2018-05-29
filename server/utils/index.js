const crypto = require('crypto');
const uuid = require('uuid');
const LogModel = require('../models/LogModel');

module.exports.udid = function () {
    return uuid.v4();
}

module.exports.setTimeoutPromise = function (timeOutMs) {
    return new Promise((resolve, reject) => {
        setTimeout(_ => {
            resolve();
        }, timeOutMs);
    })
}

module.exports.responseError = function (res, code, msg) {
    res.status(code).json({
        err: code,
        msg
    }).end();
}

module.exports.sha256Hash = function (data) {
    let stringData;
    if (typeof (data) == "object") {
        stringData = JSON.stringify(data);
    } else {
        stringData = data.toString();
    }

    const hash = crypto.createHash('sha256');
    hash.update(stringData);
    return hash.digest('hex');
}

module.exports.sha256HashBuffer = function (buffer) {
    if (!(buffer instanceof Buffer))
        throw new TypeError("arg is not instance of Buffer")

    const hash = crypto.createHash('sha256');
    hash.update(buffer);
    return hash.digest('hex');
}

module.exports.activityLog = function () {
    console.info(...arguments)
}

module.exports.userActivityLog = function ({ recordId, message, extra }) {
    LogModel.create({
        recordId,
        message,
        extra
    })
}
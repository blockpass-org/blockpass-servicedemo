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

module.exports.activityLog = function () {
    console.log('\x1b[32m%s\x1b[0m', '[info]', ...arguments)
}

module.exports.userActivityLog = function ({ userId, message, extra }) {
    LogModel.create({
        userId,
        message,
        extra
    })
}
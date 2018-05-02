const configs = require('../configs');
const cache = require('../models/cache');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const jwtVerify = promisify(jwt.verify);

// Usage: 
//  Check Header field 'Authorization'
//     scope {Array} : Empty array => only check token. not required scope

module.exports = function (scope = []) {
    return function (req, res, next) {
        const { authorization } = req.headers;

        if (authorization == null)
            return res.status(403).json({
                err: 403,
                msg: 'Required access token with scope: ' + scope.join(',')
            }).end()


        jwtVerify(authorization, configs.JWT_SECRET)
            .then(async res => {
                const { sessionId, _id } = res.data

                // check sessionId matching
                const sessionInfo = await cache.getCache(`session:${_id}`)
                if (!sessionInfo || sessionInfo.sessionId !== sessionId)
                    return res.status(403).json({
                        err: 403,
                        msg: 'Session expired'
                    }).end()

                req.session = sessionInfo

                // none scope required
                if (scope.length === 0) {
                    req.auth = res;
                    next();
                    return;
                }

                if (res.data.scope.some(value => scope.indexOf(value) !== -1)) {
                    req.auth = res;
                    next();
                } else {
                    return res.status(403).json({
                        err: 403,
                        msg: 'Permission deny. Should have one of scopes: ' + scope.join(',')
                    }).end()
                }
            })
            .catch(err => {
                return res.status(403).json({
                    err: 403,
                    msg: 'Invalid access token'
                }).end()
            })
    }
}


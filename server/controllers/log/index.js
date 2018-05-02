const express = require('express')
const restify = require('express-restify-mongoose')
const LogModel = require('../../models/LogModel');
const RequireToken = require('../../middlewares/requireToken');
const router = express.Router()

restify.serve(router, LogModel, {
    allowRegex: false,
    prefix: '',
    version: '',
    onError: (err, req, res, next) => {
        const statusCode = req.erm.statusCode // 400 or 404
        res.status(statusCode).json({
            message: err.message
        })
    },
    preMiddleware: (req, res, next) => {
        const method = req.method;
        if (method === 'GET' || method === 'OPTIONS') return next();
        res.status(403).json({
            message: 'this is read-only data'
        })
    }
})

module.exports = router
const express = require('express')
const restify = require('express-restify-mongoose')
const AdminUserModel = require('../../models/AdminUserModel');
const RequireToken = require('../../middlewares/requireToken');
const router = express.Router()

restify.serve(router, AdminUserModel, {
    allowRegex: true,
    prefix: '',
    version: '',
    totalCountHeader: true, // x-total-count for GET api
    onError: (err, req, res, next) => {
        const statusCode = req.erm.statusCode // 400 or 404
        res.status(statusCode).json({
            message: err.message
        })
    },
    preMiddleware: RequireToken(['admin'])
})

module.exports = router
const express = require('express')
const restify = require('express-restify-mongoose')
const utils = require('../../utils');
const AdminUserModel = require('../../models/AdminUserModel');
const RequireToken = require('../../middlewares/requireToken');
const router = express.Router()


router.get('/AdminUserModel/:id', RequireToken(['admin', 'reviewer']), async (req, res) => {

    const { id } = req.params

    const obj = await AdminUserModel.findById(id).select('userName').exec();

    if (!obj)
        return utils.responseError(res, 404, 'User not found')

    return res.json(obj.toObject())
})

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
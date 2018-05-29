const config = require('../../configs')
const jwt = require('jsonwebtoken')
const utils = require('../../utils')
const RequireParams = require('../../middlewares/requireParams')
const AdminUserModel = require('../../models/AdminUserModel')
const Cache = require('../../models/cache')
const RequireToken = require('../../middlewares/requireToken');
const router = require('express').Router()

/**
 * @typedef AccessToken
 * @property {string} token
 * @property {array} scope
 * @property {integer} expire
 */

 /**
 * @typedef OperatorUserProfile
 * @property {string} userName
 * @property {array} scope
 */


/**
 * This is login api
 * @route POST /auth/login
 * @group Administration - Auth
 * @consumes application/x-www-form-urlencoded
 * @param {string} userName.formData.required - username
 * @param {string} pass.formData.required - password
 * @returns {AccessToken.model} 200 - Access token
 */
router.post('/login', RequireParams(['userName', 'pass']), async (req, res) => {
    const { userName, pass } = req.body;
    const userData = await AdminUserModel.findOne({
        userName: userName
    }).exec();

    if (userData == null) return utils.responseError(res, 404, 'user not found');
    if (userData.pass != utils.sha256Hash(pass)) return utils.responseError(res, 409, 'wrong pass');

    const expTimeSec = Math.floor(Date.now() / 1000) + config.JWT_TIMEOUT_S;
    const sessionId = utils.udid();
    const uid = userData._id

    // store sessionId
    await Cache.setCache(`session:${uid}`, {
        _id: uid,
        sessionId
    })

    const token = jwt.sign({
        exp: expTimeSec,
        data: {
            _id: uid,
            sessionId: sessionId,
            scope: userData.scope,
        }
    }, config.JWT_SECRET);

    res.json({
        token: token,
        scope: userData.scope,
        expire: expTimeSec * 1000
    })
})

/**
 * This is query operator profile api
 * @route GET /auth/profile
 * @group Administration - Auth
 * @returns {OperatorUserProfile.model} 200 - Operator profile
 */
router.get('/profile', RequireToken([]), async (req, res) => {
    const { auth } = req;
    if (!auth) return utils.responseError(res, 403, 'missing accessToken');

    const { _id } = auth.data;
    const userData = await AdminUserModel.findOne({
        _id
    }).exec();

    if (!userData) return utils.responseError(res, 404, 'user not found');

    res.json(userData);
})


/**
 * This is query operator profile api
 * @route POST /auth/updatePass
 * @group Administration - Auth
 * @consumes application/x-www-form-urlencoded
 * @param {string} Authorization.header.required - accesstoken
 * @param {string} pass.formData.required - new password
 * @returns {OperatorUserProfile.model} 200 - Operator profile
 */
router.post('/updatePass', RequireToken([]), RequireParams(['pass']), async (req, res) => {
    const { auth } = req;
    const { pass } = req.body;

    if (!auth) return utils.responseError(res, 403, 'missing accessToken');

    const { _id } = auth.data;
    const userData = await AdminUserModel.findOne({
        _id
    }).exec();

    if (!userData) return utils.responseError(res, 404, 'user not found');

    userData.pass = pass

    const saveResult = await userData.save();
    if (!saveResult)
        return utils.responseError(res, 500, 'failed to update data model')

    res.json(saveResult);
})

module.exports = router
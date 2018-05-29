const config = require('../../configs')
const express = require('express')
const multer = require('multer');
const utils = require('../../utils/index')
const RequireParams = require('../../middlewares/requireParams');
const RequireToken = require('../../middlewares/requireToken');
const router = express.Router()
const upload = multer();

const getServerSdk = require('./_logicHandler');


//-------------------------------------------------------------------------
// Api
//-------------------------------------------------------------------------

/**
 * Blockpass uploadData api. Which body following path here
 * [multipart-uploaddata](https://github.com/blockpass-org/blockpass/wiki/Server_Spec_V1#2-multipart-uploaddata)
 * 
 * Return [MobileResponsePayload](https://github.com/blockpass-org/blockpass-serversdk/blob/master/doc/api.md#blockpassmobileresponsepayload)
 * 
 * @route POST /blockpass/api/uploadData
 * @group Blockpass - Mobile App endpoints
 * @consumes multipart/form-data
 * @param {string} accessToken.formData.required - one time password for upload data session
 * @param {Object} body - rawdata encoded by keyvalue
 * @returns {Object} 200 - Mobile response Payload
 */
router.post('/api/uploadData',
    upload.any(),
    RequireParams(["accessToken", "slugList"]),
    async (req, res) => {
        try {
            const { accessToken, slugList, ...userRawFields } = req.body;
            const files = req.files || [];

            // Flattern user data
            const userRawData = {}

            Object.keys(userRawFields).forEach(key => {
                const originalKey = key
                const isCert = key.startsWith('[cer]')
                if (isCert)
                    key = key.slice('[cer]'.length)

                userRawData[key] = {
                    type: 'string',
                    value: userRawFields[originalKey],
                    isCert
                }
            })

            files.forEach(itm => {
                userRawData[itm.fieldname] = {
                    type: 'file',
                    ...itm
                }
            })

            const payload = await getServerSdk().updateDataFlow({ accessToken, slugList, ...userRawData })
            return res.json(payload)

        } catch (ex) {
            console.log(ex);
            return utils.responseError(res, 403, ex.message)
        }
    })

//-------------------------------------------------------------------------

/**
 * Blockpass login api. 
 * Return [MobileResponsePayload](https://github.com/blockpass-org/blockpass-serversdk/blob/master/doc/api.md#blockpassmobileresponsepayload)
 * 
 * @route POST /blockpass/api/login
 * @group Blockpass - Mobile App endpoints
 * @consumes multipart/form-data
 * @param {string} code.formData.required - blockpass-api auth code
 * @param {string} sessionCode - sso session code
 * @returns {Object} 200 - Mobile response Payload
 */
router.post('/api/login', RequireParams(["code", "sessionCode"]), async (req, res) => {
    try {
        const code = req.body.code
        const sessionCode = req.body.sessionCode;

        const payload = await getServerSdk().loginFow({ code, sessionCode })
        return res.json(payload)
    } catch (ex) {
        console.log(ex);
        return utils.responseError(res, 403, ex.message)
    }

})

//-------------------------------------------------------------------------

/**
 * Blockpass registration api. 
 * Return [MobileResponsePayload](https://github.com/blockpass-org/blockpass-serversdk/blob/master/doc/api.md#blockpassmobileresponsepayload)
 * 
 * @route POST /blockpass/api/register
 * @group Blockpass - Mobile App endpoints
 * @consumes multipart/form-data
 * @param {string} code.formData.required - blockpass-api auth code
 * @returns {Object} 200 - Mobile response Payload
 */
router.post('/api/register', RequireParams(["code"]), async (req, res) => {
    try {
        const code = req.body.code
        const sessionCode = req.body.sessionCode;

        const payload = await getServerSdk().registerFlow({ code })
        return res.json(payload)
    } catch (ex) {
        console.log(ex);
        return utils.responseError(res, 403, ex.message)
    }
})

//-------------------------------------------------------------------------

/**
 * Blockpass check kycStatus api. 
 * Return [MobileAppKycRecordStatus](https://github.com/blockpass-org/blockpass-serversdk/blob/master/doc/api.md#mobileappkycrecordstatus)
 * 
 * @route POST /blockpass/api/register
 * @group Blockpass - Mobile App endpoints
 * @consumes multipart/form-data
 * @param {string} code.formData.required - blockpass-api auth code
 * @returns {Object} 200 - Mobile response Payload
 */
router.post('/api/status', RequireParams(["code"]), async (req, res) => {
    try {
        const code = req.body.code
        const sessionCode = req.body.sessionCode;

        const payload = await getServerSdk().queryStatusFlow({ code, sessionCode })
        return res.json(payload)
    } catch (ex) {
        console.log(ex);
        return utils.responseError(res, 403, ex.message)
    }
})


//-------------------------------------------------------------------------
// sub modules
require('./certificate')(router, getServerSdk)
require('./review')(router, getServerSdk)
require('./validation')(router, getServerSdk)

module.exports = router
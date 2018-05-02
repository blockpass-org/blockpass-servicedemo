const utils = require('../../utils/index')
const RequireParams = require('../../middlewares/requireParams');
const RequireToken = require('../../middlewares/requireToken');
const KYCModel = require('../../models/KYCModel');
const CertificateModel = require('../../models/CertificateModel');

const { REQUIRED_FIELDS } = require('./_config');

async function createCertificate(userObj, expiredDate, others = {}) {
    const customData = {}
    REQUIRED_FIELDS.forEach(key => customData[key] = userObj[key])

    return await CertificateModel.create({
        userId: userObj._id,
        blockPassID: userObj.blockPassID,
        data: customData,
        expiredAt: expiredDate,
        ...others
    })
}

//-------------------------------------------------------------------------
//  Certificate & Review process
//-------------------------------------------------------------------------

module.exports = function (router, serverSdk) {

    router.post('/api/approveCertificate',
        RequireToken(['admin', 'reviewer']),
        RequireParams(['id', 'message', 'expiredDate', 'rate']),
        async (req, res) => {
            const { id, message, expiredDate, rate } = req.body;

            const userObject = await KYCModel.findById(id).exec();

            if (!userObject)
                return utils.responseError(res, 404, 'User not found')

            userObject.status = 'approved';

            const cer = await createCertificate(userObject, expiredDate, {
                rate
            })

            const saveResult = await userObject.save();

            if (!saveResult)
                return utils.responseError(res, 500, 'failed to update data model')

            const bpTicket = await serverSdk.signCertificate({
                profileId: saveResult.blockPassID,
                kycRecord: saveResult,
                serviceInfo: {},
                claim: {}
            })

            utils.userActivityLog({
                userId: saveResult._id,
                message: message,
                extra: {
                    by: 'admin',
                    cer: cer._id,
                    action: 'approved',
                    bpTicket: bpTicket
                }
            })

            return res.json({
                cer: cer
            })
        })

    router.post('/api/rejectCertificate',
        RequireToken(['admin', 'reviewer']),
        RequireParams(['id', 'message']),
        async (req, res) => {
            const { id, message } = req.body;

            const userObject = await KYCModel.findById(id).exec();

            if (!userObject)
                return utils.responseError(res, 404, 'User not found')

            userObject.status = 'waiting';

            const saveResult = await userObject.save();

            if (!saveResult)
                return utils.responseError(res, 500, 'failed to update data model')

            const bpTicket = await serverSdk.rejectCertificate(saveResult.blockPassID, message)

            utils.userActivityLog({
                userId: saveResult._id,
                message: message,
                extra: {
                    by: 'admin',
                    action: 'reject',
                    bpTicket: bpTicket
                }
            })

            return res.json([{ ...saveResult.toObject() }])
        })
}
const utils = require('../../utils/index')
const RequireParams = require('../../middlewares/requireParams');
const RequireToken = require('../../middlewares/requireToken');
const KYCModel = require('../../models/KYCModel');

module.exports = function (router, getServerSdk) {
    router.post('/api/startReview',
        RequireToken(['admin', 'reviewer']),
        RequireParams(['id', 'message']),
        async (req, res) => {
            const { id, message } = req.body;

            const { _id } = req.auth.data

            const userObject = await KYCModel.findById(id).exec();

            if (!userObject)
                return utils.responseError(res, 404, 'User not found')

            if (userObject.status !== 'waiting')
                return utils.responseError(res, 409, 'State transition invalid')

            userObject.status = 'inreview';
            userObject.reviewer = _id;

            const saveResult = await userObject.save();

            if (!saveResult)
                return utils.responseError(res, 500, 'failed to update data model')

            utils.userActivityLog({
                recordId: saveResult._id,
                message: 'record-start-review',
                extra: {
                    by: _id
                }
            })

            return res.json([{ ...userObject.toObject() }])
        })

    router.post('/api/sendFeedback',
        RequireToken(['admin', 'reviewer']),
        RequireParams(['id', 'message', 'decisions']),
        async (req, res) => {
            const { id, message, decisions } = req.body;
            const { _id } = req.auth.data;

            const kycRecord = await KYCModel.findById(id).exec();

            if (!kycRecord)
                return utils.responseError(res, 404, 'User not found')

            if (kycRecord.reviewer != _id)
                return utils.responseError(res, 409, 'Reviewer missmatching')

            if (kycRecord.status !== 'inreview')
                return utils.responseError(res, 409, 'State transition invalid')

            // kycRecord.status = 'waiting';
            for (let index in decisions) {

                const { slug, comment, status, type } = decisions[index];

                if (['approved', 'rejected'].indexOf(status) === -1) {
                    return utils.responseError(res, 400, 'Status must be approved or rejected')
                }

                switch (type) {
                    case 'identities':
                        {
                            const info = kycRecord.fieldStatus(slug);
                            if (info.status === 'missing')
                                return utils.responseError(res, 409, 'Field not found ' + slug)

                            kycRecord.reviews = {
                                ...kycRecord.reviews,
                                [slug]: {
                                    status: status,
                                    comment,
                                    updatedAt: new Date()
                                }
                            }
                        }
                        break;
                    case 'certificates':
                        {
                            const info = kycRecord.certStatus(slug);
                            if (info.status === 'missing')
                                return utils.responseError(res, 409, 'certificates not found ' + slug)

                            kycRecord.reviews = {
                                ...kycRecord.reviews,
                                [slug]: {
                                    status: status,
                                    comment,
                                    updatedAt: new Date()
                                }
                            }
                        }
                        break;
                    default:
                        break;
                }

                utils.userActivityLog({
                    recordId: kycRecord._id,
                    message: 'field-decision',
                    extra: {
                        by: kycRecord.reviewer,
                        slug,
                        comment,
                        status,
                        type
                    }
                })
            }

            const { bpToken } = kycRecord;

            // todo: send notice to user
            const bpTicket = await getServerSdk().userNotify({
                message,
                bpToken
            })

            kycRecord.waitingUserResubmit = true;
            kycRecord.summary = message;
            
            const saveResult = await kycRecord.save();

            if (!saveResult)
                return utils.responseError(res, 500, 'failed to update data model')

            
            utils.userActivityLog({
                recordId: saveResult._id,
                message: 'record-feedback',
                extra: {
                    by: _id,
                    action: 'feedback',
                    message
                }
            })

            return res.json([{ ...saveResult.toObject() }])
        })
}

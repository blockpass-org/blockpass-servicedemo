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
                userId: saveResult._id,
                message: message,
                extra: {
                    by: 'admin'
                }
            })

            return res.json([{ ...userObject.toObject() }])
        })
}

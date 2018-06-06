const _config = require('../../configs')
const utils = require('../../utils/index')
const RequireParams = require('../../middlewares/requireParams');
const RequireToken = require('../../middlewares/requireToken');
const KYCModel = require('../../models/KYCModel');
const CertificateModel = require('../../models/CertificateModel');

const { CROSS_DB_FIELD_MAPS_INVERSE } = require('../blockPass/_config')

//-------------------------------------------------------------------------
//  WIP - will refactor
//-------------------------------------------------------------------------

// JsonLD suggest stored data under camel case
function toCamel(input) {
    return input.replace(/(\_[a-z])/g, function ($1) { return $1.toUpperCase().replace('_', ''); });
};

async function generateCertificate(kycRecord, message, serverSdk, others = '') {
    const organizationInfo = {
        identifier: serverSdk.clientId,
        legalName: 'Demo Certificate from Blockpass',
        logo: 'http://www.dummymag.com//media/img/dummy-logo.png',
    }

    const hashIdentities = {}
    await Object.keys(kycRecord.identities)
       .forEach(async key => {
           const bpKey = CROSS_DB_FIELD_MAPS_INVERSE[key]
           if (!bpKey) return;

           const hashVal = await kycRecord.getIdentityHash(key)
           if (hashVal)
               hashIdentities[toCamel(bpKey)] = hashVal
       })

    const entityInfo = {
        ...hashIdentities,
        rootHash: utils.sha256Hash(kycRecord.bpProfile.rootHash),
        type: 'person'
    }

    const now = new Date();

    const claimInfo = {
        reviewBody: message,
        issueDate: now.toISOString(),
        _customFields: others
    }

    return {
        id: 'demo-service-cert',
        entityInfo,
        organizationInfo,
        claimInfo
    }
}

//-------------------------------------------------------------------------
//  Certificate & Review process
//-------------------------------------------------------------------------

module.exports = function (router, getServerSdk) {

    router.post('/api/approveCertificate',
        RequireToken(['admin', 'reviewer']),
        RequireParams(['id', 'message', 'decisions']),
        async (req, res) => {
            try {
                const { id, message, decisions } = req.body;
                const { _id } = req.auth.data;


                const kycRecord = await KYCModel.findById(id).exec();

                if (!kycRecord)
                    return utils.responseError(res, 404, 'User not found')

                if (kycRecord.reviewer != _id)
                    return utils.responseError(res, 409, 'Reviewer missmatching')

                if (kycRecord.status !== 'inreview')
                    return utils.responseError(res, 409, 'State transition invalid')

                // update decision
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

                kycRecord.status = 'approved';
                kycRecord.summary = message;

                const cerObject = await generateCertificate(kycRecord, message || "", getServerSdk(), "extraThing -> here")

                const { bpToken } = kycRecord
                const EcdsaPrivateKey = _config.CERTIFICATE_SIGN_PRIVATE
                const EcdaPublicKey = _config.CERTIFICATE_SIGN_PUBLIC

                const bpSignRes = await getServerSdk().signCertificate({
                    ...cerObject,

                    EcdsaPrivateKey,
                    EcdaPublicKey,

                    bpToken
                })

                if (!bpSignRes)
                    return utils.responseError(res, 500, 'Sign certificate error')

                const saveResult = await kycRecord.save();

                if (!saveResult)
                    return utils.responseError(res, 500, 'failed to update data model')


                // Store issued certificate
                let cer = new CertificateModel({
                    kycId: saveResult._id,
                    blockPassID: kycRecord.blockPassID,
                    data: {
                        cerObject: cerObject,
                        bpSignRes: bpSignRes
                    }
                })
                cer = await cer.save();

                // Log
                utils.userActivityLog({
                    recordId: saveResult._id,
                    message: 'record-approve',
                    extra: {
                        by: _id,
                        cerID: cer._id,
                        bpSignRes: bpSignRes
                    }
                })

                //[PushNotification] Send notice to user
                const pnTitle = 'Blockpass demo certificate'
                const pnMessage = message
                const bpTicket = await getServerSdk().userNotify({
                    message: pnMessage,
                    title: pnTitle,
                    bpToken
                })

                return res.json({
                    cer: cer
                })

            } catch (error) {
                console.error(error);
                return utils.responseError(res, 500, 'issued certificate failed')
            }
        })
}
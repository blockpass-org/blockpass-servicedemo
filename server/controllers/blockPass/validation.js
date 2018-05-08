const utils = require('../../utils/index')
const RequireParams = require('../../middlewares/requireParams');
const RequireToken = require('../../middlewares/requireToken');
const KYCModel = require('../../models/KYCModel');
const GridFSHelper = require('../../models/GridFsFileStorage');
const { CROSS_DB_FIELD_MAPS_INVERSE, FIELD_TYPE_MAPS } = require('./_config');


//-------------------------------------------------------------------------
//  KYC validation
//-------------------------------------------------------------------------
module.exports = function (router, getServerSdk) {
    router.post('/api/validate/proofPath',
        RequireToken(['admin', 'reviewer']),
        RequireParams(['id', 'slugList']),
        async (req, res) => {
            try {
                const { id, slugList } = req.body;

                const kyc = await KYCModel.findById(id).exec();
                if (!kyc) return utils.responseError(res, 404, 'Kyc not found')

                if (kyc.bpProfile.isSynching) {
                    // [Todo] Refresh Sync status
                    return utils.responseError(res, 409, 'user kyc is syncing')
                }

                let blockPassFieldName = slugList.map(itm => CROSS_DB_FIELD_MAPS_INVERSE[itm])
                console.log(CROSS_DB_FIELD_MAPS_INVERSE, slugList, blockPassFieldName)
                const bpResponse = await getServerSdk().queryProofOfPath({
                    kycToken: kyc.bpToken, 
                    slugList: blockPassFieldName
                })

                if (!bpResponse)
                    return utils.responseError(res, 500, 'Block pass query proof error')

                let { bpToken, proofOfPath } = bpResponse
                kyc.bpToken = bpToken;
                await kyc.save();

                // Perform proof path validation here
                const { proofList } = proofOfPath;
                const { rootHash } = kyc.bpProfile

                const proofOfCheck = slugList.map(async fieldName => {
                    const bpName = CROSS_DB_FIELD_MAPS_INVERSE[fieldName];
                    let rawData = kyc.identities[fieldName];
                    const fieldType = FIELD_TYPE_MAPS[bpName]
                    if (fieldType === 'file')
                        rawData = await GridFSHelper.readFileAsBuffer(rawData)

                    console.log(fieldName, rawData)
                    const proofPath = proofList[bpName];

                    if (proofPath == null)
                        throw new Error('Blockpass missing field ' + fieldName)

                    const isValid = getServerSdk().merkleProofCheckSingle(rootHash, rawData, proofPath);

                    return {
                        isValid,
                        fieldName,
                        bpName,
                        proofPath
                    }
                })

                //Todo: Smart contract checking root hash

                const rootCheck = await Promise.all(proofOfCheck);
                res.json(
                    {
                        rootCheck
                    }
                )
            } catch (error) {
                console.log(error)
                utils.responseError(res, 500, error.message)
            }
        })
}

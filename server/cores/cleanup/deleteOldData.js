const _config = require('../../configs')
const KYCModel = require('../../models/KYCModel')
const LogModel = require('../../models/LogModel')
const GridFsFileStorage = require('../../models/GridFsFileStorage')

async function deleteOldData(before) {
    const now = Date.now()

    if (before <= 0)
        return;

    const deleteBefore = new Date(now - parseInt(before))

    try {
        const listItems = await KYCModel.find({
            "$and": [
                { 'status': ['approved', 'waiting'] },
                { 'createdAt': {'$lt': deleteBefore } }
            ]
        }).select("_id").exec() || []

        console.log("[deleteOldData] before:", deleteBefore)
        console.log("[deleteOldData] list:",listItems)
        
        const allJobs = listItems.map(async (itm) => {
            const _id = itm._id
            await GridFsFileStorage.deleteFileBelongToRecordId(_id)
            await KYCModel.findByIdAndRemove(_id).exec()
            await LogModel.remove({
                recordId: _id
            }).exec()

            console.log("[deleteOldData] done:", _id)
        })

        return await Promise.all(allJobs);
    } catch (err) {
        console.error(err)
    }
}

module.exports = deleteOldData
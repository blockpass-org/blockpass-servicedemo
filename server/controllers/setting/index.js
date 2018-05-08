const _config = require('../../configs');
const express = require('express')
const utils = require('../../utils')
const SettingModel = require('../../models/SettingModel');
const Events = require('../../models/events');
const AdminUserModel = require('../../models/AdminUserModel');
const RequireToken = require('../../middlewares/requireToken');
const RequireParam = require('../../middlewares/requireParams');
const router = express.Router()

const adminTokenCheck = RequireToken(['admin'])

router.get('/', async (req, res) => {
    const allSetting = await SettingModel.find({})
    return res.json(allSetting)
})

router.put('/:id', adminTokenCheck, async (req, res) => {
    const { id, values: body } = req.body
    const itm = await SettingModel.findById(id).exec()
    if (!itm) return utils.responseError(res, 404, 'Setting id not found')

    // merge
    Object.keys(body).forEach(key => {
        const val = body[key];
        newValue = itm['fields'].map(item => {
            if (item._id === key) {
                item['value'] = val
            }
        })

        Object.assign({}, itm, { fields: newValue });
    })

    const saveRes = await itm.save();

    if (!saveRes) return utils.responseError(res, 500, 'Update data model error')

    Events.pub('onSettingChange', saveRes._id)

    res.json(saveRes)
})

router.post('/setup', RequireParam(['deployKey', 'settings']), async (req, res) => {
    const itmCount = await SettingModel.find().count().exec()
    if (itmCount !== 0) return utils.responseError(res, 409, 'You are trying to call setup multiple times')

    const body = req.body;
    const { deployKey, settings } = body;

    if (deployKey !== _config.DELOY_SECRET_KEY)
        return utils.responseError(res, 409, 'Wrong deploy secret key')

    const jobs = []
    const { adminPass } = settings;

    if (!adminPass)
        return utils.responseError(res, 400, 'Missing required setting key')

    const _addSettingJob = async (doc) => {
        const itm = new SettingModel(doc)
        const saveRes = await itm.save()
        Events.pub('onSettingChange', saveRes._id)
        return saveRes
    }

    if (adminPass) {
        const tmp = async () => {
            const admin = new AdminUserModel({
                userName: 'admin',
                pass: adminPass,
                scope: ['admin']
            });

            return await admin.save();
        };
        jobs.push(tmp())
    }

    // Blockpass Api settings
    jobs.push(_addSettingJob({
        _id: 'blockpass-settings',
        label: 'Blockpass Settings',
        fields: [{
            _id: 'Required fields',
            value: _config.DEFAULT_REQUIRED_FIELDS.join(','),
            _display: {
                type: 'input',
            }
        },
        {
            _id: 'Optional fields',
            value: _config.DEFAULT_OPTIONAL_FIELDS.join(','),
            _display: {
                type: 'input',
                hidden: true
            }
        },
        {
            _id: 'Certificates',
            value: _config.DEFAULT_CERTS.join(','),
            _display: {
                type: 'input',
            }
        }]
    }
    )
    )

    const setupSettingSave = await Promise.all(jobs);

    if (!setupSettingSave) return utils.responseError(res, 500, 'Update data model error')

    res.json(setupSettingSave);
})

module.exports = router
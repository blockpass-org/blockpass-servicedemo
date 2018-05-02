const _config = require('../../configs');
const express = require('express')
const utils = require('../../utils')
const GridFsFileStorage = require('../../models/GridFsFileStorage');
const RequireToken = require('../../middlewares/requireToken');
const router = express.Router()

const tokenCheck = RequireToken(['admin', 'reviewer'])

router.get('/:id', (req, res) => {
    const id = req.params.id
    var readstream = GridFsFileStorage.readFile(id);
    
    readstream.on('error', function (err) {
        console.log(err)
        utils.responseError(res, 404, "file not found")
    });

    readstream.pipe(res);
})

module.exports = router
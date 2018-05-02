const express = require('express')
const router = express.Router()

router.use("/healthCheck", require('./healthCheck'))
router.use("/blockpass", require('./blockPass'))
router.use("/auth", require('./auth'))
router.use("/setting", require('./setting'))

// res api
router.use("/api/v1", require('./admin'))
router.use("/api/v1", require('./kyc'))
router.use("/api/v1", require('./log'))
router.use("/api/v1", require('./cert'))

// Default routes
router.use("/", (req, res) => res.json("api not found"))

module.exports = router
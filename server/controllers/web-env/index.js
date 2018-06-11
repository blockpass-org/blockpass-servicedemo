const express = require('express')
const router = express.Router()

const serialize = (config) => {
    return `window.env = ${JSON.stringify(config)}`
}

const dashboardEnv = {
    API_HOST: '',
    REACT_APP_ENV: process.NODE_ENV
}

const webEnv = {
    BLOCKPASS_CLIENT_ID: process.env.BLOCKPASS_CLIENT_ID,
    BLOCKPASS_BASE_URL: process.env.BLOCKPASS_BASE_URL
}

router.get('/dashboard/env.js', function (req, res) {
    res.set('Content-Type', 'application/javascript');
    res.send(serialize(dashboardEnv));
})

router.get('/web/env.js', function (req, res) {
    res.set('Content-Type', 'application/javascript');
    res.send(serialize(webEnv));
})

module.exports = router
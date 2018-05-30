const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const _config = require('./configs')
const models = require('./models');

const app = express()

const controllerRoute = require('./controllers');
const intervalCheck = require('./cores/cleanup/intervalCheck')
const deleteOldData = require('./cores/cleanup/deleteOldData')

// Allow access origin
app.use(cors({
  exposedHeaders: ['X-Total-Count']
}));
app.disable('x-powered-by');

// static file
app.use(express.static(__dirname + '/public'))


// swagger doc 
if (process.env.SWAGGER_DOC) {
  console.info("[SWAGGER_DOC] enable at /api-docs/")
  require('./utils/swagger-doc')(app);
}

// middleware
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(require('./middlewares/requestLog'))
app.use(require('./middlewares/requestTrapError')(controllerRoute))

const port = process.env.SERVER_PORT || 3000

let server = app.listen(port, '0.0.0.0', function () {
  console.log(`Listening on port ${port}...`)
})

// clean-up old data schedule
if (_config.KYC_RECORD_EXPIRED_AFTER_MS) {
  console.info(`[cleanup] check every ${_config.KYC_RECORD_EXPIRED_AFTER_MS} ms`)
  intervalCheck(function () {
    deleteOldData(_config.KYC_RECORD_EXPIRED_AFTER_MS)
  }, 30000)
}

// gracefull shutdown
app.close = _ => server.close();

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

module.exports = app;
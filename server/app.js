const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const models = require('./models');

const app = express()

// Allow access origin
app.use(cors({
  exposedHeaders: ['X-Total-Count']
}));
app.disable('x-powered-by');

// static file
app.use(express.static(__dirname + '/public'))

// middleware
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(require('./middlewares/requestLog'))

app.use(require('./controllers'))

const port = process.env.SERVER_PORT || 3000

let server = app.listen(port, '0.0.0.0', function() {
  console.log(`Listening on port ${port}...`)
})

// gracefull shutdown
app.close = _ => server.close();

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

module.exports = app;
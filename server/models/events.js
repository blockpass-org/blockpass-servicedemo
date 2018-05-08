const EventEmitter = require('events');

const eventObj = new EventEmitter();

module.exports = {
    sub: function (topic, callback) {
        eventObj.on(topic, callback)
    },

    unSub: function (topic, callback) {
        eventObj.removeListener(topic, callback)
    },

    pub: function (topic, data) {
        eventObj.emit(topic, data)
    }
}


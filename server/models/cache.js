const mongoose = require('mongoose');

// Define schema
var Schema = mongoose.Schema;

var CacheModelSchema = new Schema({
    _id: Schema.Types.String,
    value: Schema.Types.Mixed,
    expiredAt: Schema.Types.Date
});

CacheModelSchema.index({ "expireAt": 1 }, { expireAfterSeconds: 0 })

// Compile model from schema
const CacheModel = mongoose.model('CacheModel', CacheModelSchema);

async function setCache(key, val, ttlMs = 1 * 30 * 50 * 1000) {
    return await CacheModel.findByIdAndUpdate(key, {
        value: val,
        expiredAt: new Date(Date.now() + ttlMs)
    }, { upsert: true, new: true }).exec()
}

async function getCache(key) {
    const data = await CacheModel.findById(key).exec()
    if (!data) return null;
    return data.value
}

//TTin: Todo implement cache 
module.exports = {
    setCache,
    getCache
}
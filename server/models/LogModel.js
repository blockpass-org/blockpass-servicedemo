const mongoose = require('mongoose');

// Define schema
var Schema = mongoose.Schema;

var LogModelSchema = new Schema({
    userId: Schema.Types.ObjectId,
    message: String,
    extra: Schema.Types.Mixed
}, { timestamps: true });

LogModelSchema.index({ userId: 1 })

// Compile model from schema
const LogModel = mongoose.model('LogModel', LogModelSchema);

module.exports = LogModel;
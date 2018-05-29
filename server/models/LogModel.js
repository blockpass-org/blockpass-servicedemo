const mongoose = require('mongoose');

// Define schema
var Schema = mongoose.Schema;

var LogModelSchema = new Schema({
    recordId: Schema.Types.ObjectId,
    message: String,
    extra: Schema.Types.Mixed
}, { timestamps: true });

LogModelSchema.index({ recordId: 1 })

// Compile model from schema
const LogModel = mongoose.model('LogModel', LogModelSchema);

module.exports = LogModel;
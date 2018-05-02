const mongoose = require('mongoose');

// Define schema
var Schema = mongoose.Schema;

var CertificateModelSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    blockPassID: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        default: 1
    },
    data: Schema.Types.Mixed,
    expiredAt: Schema.Types.Date,
}, { timestamps: true });

CertificateModelSchema.index({ userId: 1 })

// Compile model from schema
const CertificateModel = mongoose.model('CertificateModel', CertificateModelSchema);

module.exports = CertificateModel;
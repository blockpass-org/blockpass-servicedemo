const mongoose = require('mongoose');

// Define schema
var Schema = mongoose.Schema;

var CertificateModelSchema = new Schema({
    kycId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    blockPassID: {
        type: String,
        required: true
    },
    data: Schema.Types.Mixed,
}, { timestamps: true });

CertificateModelSchema.index({ kycId: 1 })

// Compile model from schema
const CertificateModel = mongoose.model('CertificateModel', CertificateModelSchema);

module.exports = CertificateModel;
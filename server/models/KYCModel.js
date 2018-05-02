const { sha256Hash } = require('../utils');
const mongoose = require('mongoose');

// Define schema
var Schema = mongoose.Schema;

var KYCModelSchema = new Schema({
    email: String,
    reviewer: Schema.Types.ObjectId,
    blockPassID: String,
    fristName: String,
    lastName: String,
    phone: String,
    email: String,
    proofOfAddress: String,
    passport: String,
    picture: String,
    etherAddress: String,
    onfidoCertificate: String,
    status: {
        type: String,
        enum: ['waiting', 'inreview', 'approved'],
        default: 'waiting'
    },
    bpToken: {
        access_token: String,
        expires_in: Date,
        refresh_token: String,
    },
    rootHash: String,
    smartContractId: String,
    isSynching: Boolean,
    smartContractAddress: String,
    network: String
}, { timestamps: true });

KYCModelSchema.index({ blockPassID: 1 })
KYCModelSchema.pre('save', function (next) {
    var kyc = this;
    if (!kyc.isModified('bpToken')) return next();
    
    if (! (kyc.bpToken.expires_in instanceof Date)) {
        if (!isNaN(kyc.bpToken.expires_in)) {
            const expiredDate = new Date(Date.now() + kyc.bpToken.expires_in * 1000)
            kyc.bpToken.expires_in = expiredDate
        }
    }

    next();
});

// Compile model from schema
const KYCModel = mongoose.model('KYCModel', KYCModelSchema);


module.exports = KYCModel;
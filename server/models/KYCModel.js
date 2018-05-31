const mongoose = require('mongoose');
const utils = require('../utils');
const FileStorage = require('./GridFsFileStorage');

const FileFields = [
    'proofOfAddress',
    'picture',
    'passport'
]

// Define schema
var Schema = mongoose.Schema;

var KYCModelSchema = new Schema({
    reviewer: Schema.Types.ObjectId,
    blockPassID: String,
    waitingUserResubmit: Boolean,
    summary: String,
    submitCount: {
        type: Number,
        default: 0
    },

    identities: {
        firstName: String,
        lastName: String,
        phone: String,
        email: String,
        proofOfAddress: String,
        passport: String,
        picture: String,
        dob: String,
        address: String
    },

    extraData: {
        etherAddress: String,
    },

    certs: {
        onfidoCertificate: String,

        type: Schema.Types.Mixed,
        default: {}
    },

    status: {
        type: String,
        enum: ['waiting', 'inreview', 'approved'],
        default: 'waiting'
    },

    bpToken: {
        access_token: String,
        expires_at: Date,
        refresh_token: String,
    },

    reviews: {
        type: Schema.Types.Mixed,
        default: {}
    },

    bpProfile: {
        rootHash: String,
        smartContractId: String,
        isSynching: Boolean,
        smartContractAddress: String,
        network: String
    }

}, { timestamps: true });

KYCModelSchema.index({ blockPassID: 1 })

KYCModelSchema.methods.fieldStatus = function (name) {
    const reviews = this.reviews || {}
    const val = this.identities[name];
    const reviewResult = reviews[name];

    if (!val)
        return {
            status: 'missing'
        }

    if (!reviewResult)
        return {
            status: 'received'
        }

    const { status, comment } = reviewResult
    return {
        status: status,
        comment
    }
}

KYCModelSchema.methods.certStatus = function (name) {
    const reviews = this.reviews || {}
    const certs = this.certs || {}
    const val = certs[name];
    const reviewResult = reviews[name];

    if (!val)
        return {
            status: 'missing'
        }

    if (!reviewResult)
        return {
            status: 'received'
        }

    const { status, comment } = reviewResult
    return {
        status: status,
        comment
    }
}

KYCModelSchema.methods.getIdentityHash = async function (field) {
    const { identities = {} } = this;
    const rawVal = identities[field]

    if (!rawVal) return null;

    if (FileFields.indexOf(field) !== -1) {
        try {
            const rawBin = await FileStorage.readFileAsBuffer(rawVal);
            return utils.sha256HashBuffer(rawBin);
        } catch (err) {
            console.error(err)
            return null;
        }
    }

    return utils.sha256Hash(rawVal);
}

// Compile model from schema
const KYCModel = mongoose.model('KYCModel', KYCModelSchema);

module.exports = KYCModel;
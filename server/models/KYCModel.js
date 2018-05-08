const mongoose = require('mongoose');

// Define schema
var Schema = mongoose.Schema;

var KYCModelSchema = new Schema({
    reviewer: Schema.Types.ObjectId,
    blockPassID: String,
    
    identities: {
        fristName: String,
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
        expires_in: Date,
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
KYCModelSchema.pre('save', function (next) {
    var kyc = this;
    if (!kyc.isModified('bpToken')) return next();

    if (!(kyc.bpToken.expires_in instanceof Date)) {
        if (!isNaN(kyc.bpToken.expires_in)) {
            const expiredDate = new Date(Date.now() + kyc.bpToken.expires_in * 1000)
            kyc.bpToken.expires_in = expiredDate
        }
    }

    next();
});

KYCModelSchema.methods.fieldStatus = function(name) {
    const reviews = this.reviews || {}
    const val = this.identities[name];
    const reviewResult = reviews[name];

    if(!val)
        return {
            status: 'missing'
        }

    if(!reviewResult) 
        return {
            status: 'waiting'
        }

    const {decision, comment} = reviewResult
    return {
        status: decision,
        comment
    }
}

KYCModelSchema.methods.certStatus = function(name) {
    const reviews = this.reviews || {}
    const certs = this.certs || {}
    const val = certs[name];
    const reviewResult = reviews[name];

    if(!val)
        return {
            status: 'missing'
        }

    if(!reviewResult) 
        return {
            status: 'waiting'
        }

    const {decision, comment} = reviewResult
    return {
        status: decision,
        comment
    }
}

// Compile model from schema
const KYCModel = mongoose.model('KYCModel', KYCModelSchema);


module.exports = KYCModel;
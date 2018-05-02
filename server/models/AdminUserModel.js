const { sha256Hash } = require('../utils');
const mongoose = require('mongoose');

// Define schema
var Schema = mongoose.Schema;

var AdminUserModelSchema = new Schema({
    userName: String,
    pass: String,
    etherAddress: String,
    scope: [String],
}, { timestamps: true });

AdminUserModelSchema.index({ userName: 1 }, { unique: true })
AdminUserModelSchema.pre('save', function (next) {
    var user = this;
    if (!user.userName)
        user.userName = (new mongoose.mongo.ObjectId()).toHexString();

    if (!user.isModified('pass')) return next();
    user.pass = sha256Hash(user.pass);
    next();
});


// Compile model from schema
const AdminUserModel = mongoose.model('AdminUserModel', AdminUserModelSchema);


module.exports = AdminUserModel;
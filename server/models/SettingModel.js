const mongoose = require('mongoose');

// Define schema
var Schema = mongoose.Schema;

var SettingModelSchema = new Schema({
    label: String,
    fields: [{
                _id: String,
                value: String,
                _display: Schema.Types.Mixed
            }]
}, { timestamps: true });

// Compile model from schema
const SettingModel = mongoose.model('SettingModel', SettingModelSchema);

module.exports = SettingModel;
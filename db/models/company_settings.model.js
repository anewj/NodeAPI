const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    information: {
        name: {type: String, required: true},
        address: {type: String, required: true},
        contactNumber: [{number: {type: Number, required: true}}],
        faxNumber: {type: Number, required: true},
        emailAddress: {type: String, required: true},
        website: {type: String, required: true}
    },
    registrationInfo: {
        type: {type: String, required: true, default: 'NONE'},
        vat_panNumber: {type: Number, required: true}
    },
    invoiceNumberSettings: {
        prefix: {type: String, required: true},
        digits: {type:  Number, required: true},
    },
    vatPercentage: {type: Number, required: true, default: 13},
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Company_Settings', schema);

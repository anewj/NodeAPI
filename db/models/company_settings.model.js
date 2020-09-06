const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    information: {
        name: {type: String},
        address: {type: String},
        contactNumber: [{number: {type: Number}}],
        faxNumber: {type: Number},
        emailAddress: {type: String},
        website: {type: String}
    },
    registrationInfo: {
        type: {type: String, default: 'NONE'},
        vat_panNumber: {type: Number}
    },
    invoiceNumberSettings: {
        prefix: {type: String},
        digits: {type:  Number},
    },
    vatPercentage: {type: Number, default: 13},
    bankAccounts: [
        {
            bankName: {type: String},
            branch: {type: String},
            accountName: {type: String},
            accountNumber: {type: String}
        }
    ],
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Company_Settings', schema);

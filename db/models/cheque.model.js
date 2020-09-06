const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    customerID: {type: Schema.Types.ObjectId, ref: 'Party', required: true},
    InvoiceNumber: {type: String, required: true},
    InvoiceId: {type: Schema.Types.ObjectId, ref: 'InvoiceDump', required: true},
    amount: {type: Number, required: true},
    number: {type: Number, required: true},
    acName: {type: String, required: true},
    bankName: {type: String, required: true},
    date: {type: String, required: true},
    isMiti: {type: Boolean, required: true, default: true},
    cleared: {type: Boolean, required: true, default: false},
    clearing: {type: Boolean, required: true, default: false},
    clearedDate: {type: Date},
    cash: {type: Boolean, required: true, default: false},
    depositAccount: {type: Schema.Types.ObjectId, ref: 'InvoiceDump.bankAccounts'},
    bounce: [
        {
            reason: {type: String, required: true},
            date: {type: Date, required: true}
        }
    ],
    createdDate: {type: Date, required: true, default: Date.now},
    updatedDate: {type: Date, required: true, default: Date.now},
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Cheque', schema);

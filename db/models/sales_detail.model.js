const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    invoiceDumpRef: {type: Schema.Types.ObjectId, ref: 'InvoiceDump', required: true},
    invoiceNumber: {type: String, required: true},
    customer: {type: Schema.Types.ObjectId, ref: 'Party', required: true},
    payment: {
        tenderAmount: {type: String},
        change: {type: Number},
        chequeDetail: {
            amount: {type: String},
            number: {type: String},
            acHolder: {type: String},
            bankName: {type: String},
            date: {type: String},
            isMiti: {type: Boolean}
        },
    },
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('SalesDetail', schema);

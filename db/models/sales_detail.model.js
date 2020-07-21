const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    invoiceDumpRef: {type: Schema.Types.ObjectId, ref: 'InvoiceDump', required: true},
    gTotal: {type: String},
    roundOff: {type: String},
    fTotal: {type: String},
    tenderAmount: {type: String},
    chequeDetail: {
        amount: {type: String},
        number: {type: String},
        acHolder: {type: String},
        bankName: {type: String},
        date: {type: String}
    },
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('SalesDetail', schema);

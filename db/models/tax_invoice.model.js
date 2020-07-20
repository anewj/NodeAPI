const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    invoiceDumpRef: {type: Schema.Types.ObjectId, ref: 'InvoiceDump', required: true},
    invoiceNumber: {type: String, required: true, unique: true},
    date: {type: Date, required: true},
    nepalDate: {type: String, required: true},
    partyInformation: {
        _id: {type: Schema.Types.ObjectId, ref: 'Party'},
        title: {type: String},
        name: {type: String},
        code: {type: String},
        contactNumber: [{
            number: {type: Number}
        }],
        emailAddress: {type: String},
        address: {type: String},
        PAN: {type: Number},
        createdDate: {type: Date},
        updatedDate: {type: Date},
    },
    purchasedItems: {
        items: [{
            item: {
                _id: {type: String},
                code: {type: String},
                name: {type: String},
            },
            unit: {
                unit: {
                    name: {type: String},
                }
            },
            rate: {type: String},
            pcs: {type: Number},
            amount: {type: String},
            discount: {type: String},
            discountAmount: {type: String},
            total: {type: String},
        }],
        nTotal: {type: String},
        totalBeforeDiscount: {type: String},
        nDiscount: {type: String},
        vat: {type: String},
        discount: {type: String},
        gTotal: {type: String},
        discountPercentage: {type: String},
        discountAmount: {type: String},
        totalAfterDiscountAmount: {type: String}
    },
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('TaxInvoice', schema);

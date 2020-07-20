const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('./tax_invoice_counter.model');
const config = require('../../config/config');


const invoiceDump = new Schema({
    date: {type: Date, required: true},
    nepalDate: {type: String, required: true},
    invoiceNumber: {type: String, required: true, unique: true},
    invoiceCounter: {type: Number, required: true, unique: true},
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
                units: [{
                    _id: {type: String},
                    position: {type: Number},
                    rate: {type: Number},
                    unit: {
                        _id: {type: String},
                        name: {type: String},
                        code: {type: String},
                        createdDate: {type: Date},
                        updatedDate: {type: Date},
                    }
                }],
                vendor: {
                    _id: {type: String},
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
                createdDate: {type: Date},
                updatedDate: {type: Date},
            },
            unit: {
                _id: {type: String},
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
            stockDeduct: {type: Number}
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

invoiceDump.pre('validate', function (next, val) {
    const doc = this;
    Counter.findOneAndUpdate({_id: config.autoIncrementID}, {$inc: {counter: 1}}, function (error, counter) {
        if (error) {
            doc.invalidate('ERRORS', error);
            return next(error);
        }
        next();
    })
});

invoiceDump.set('toJSON', {virtuals: true});
module.exports = mongoose.model('InvoiceDump', invoiceDump);

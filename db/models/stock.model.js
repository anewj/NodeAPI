const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    product_id: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
    quantity: {type: Number, required: true, default: 0},
    availableQuantity: {type: Number, required: true, default: 0},
    unit_id: {type: Schema.Types.ObjectId, ref: 'Unit', required: true},
    lowStock: {
        warn: {type: Boolean, default: false, required: true},
        quantity: {type: Number}
    },
    midStock: {
        warn: {type: Boolean, default: false, required: true},
        quantity: {type: Number}
    },
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Stock', schema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    product_id: {type: Schema.Types.ObjectId, ref: 'Product'},
    price: {
        list_price: {type: Number, required: true},
        offer_price: {type: Number, required: true},
    },
    quantity: {type: Number, required: true, default: 0},
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Price', schema);
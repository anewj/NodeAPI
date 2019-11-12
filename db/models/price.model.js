const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    product_id: {type: Schema.Types.ObjectId, ref: 'Product'},
    price: {type: Number, required: true},
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Price', schema);
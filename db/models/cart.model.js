const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    product: {type: Schema.Types.ObjectId, ref: 'Product'},
    quantity: {type: Number, required: true, max: 5},
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Cart', schema);
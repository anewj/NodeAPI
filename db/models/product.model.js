const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    manufacturer: {type: Schema.Types.ObjectId, ref: 'Manufacturer'},
    price: {
        list_price: {type: Number, required: true},
        offer_price: {type: Number, required: true},
    },
    archive: {type: Boolean, required: true, default: false},
    pre_order: {type: Boolean, required: true, default: true},
    identifier: {type: String, required: true, unique: true},
    tags: {type: [String], index: true},
    toy_line: {type: String, required: false},
    universe: {type: String, required: false},
    image_url: {type: String, required: true},
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Product', schema);
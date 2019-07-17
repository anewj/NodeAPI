const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    manufacturer: { type: String, required: true },
    listPrice: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    archive: { type: Boolean, required: true, default: false },
    preOrder: { type: Boolean, required: true, default: true },
    quantity: {type: Number, required:false},
    identifier: {type: String, required:true, unique: true},
    tags: { type: [String], index: true },
    toyLine: { type: String, required: false },
    universe: { type: String, required: false },
    imageUrl: {type: String, required: true},
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ProductOld', schema);
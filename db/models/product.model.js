const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    code: {type: String, required: true, unique: true},
    name: {type: String, required: true, unique: true},
    weight: {type: Number, required: true},
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Product', schema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    manufacturer: {type: String, required: true, unique: true},
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Manufacturer', schema);
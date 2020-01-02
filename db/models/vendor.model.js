const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {type: String, required: true, unique: true},
    code: {type: String, unique: true},
    contactNumber: [{
        number: {type: Number}
    }],
    emailAddress: {type: String},
    address: {type: String},
    PAN: {type: Number, unique: true},
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Vendor', schema);

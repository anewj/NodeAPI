const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counterSchema = new Schema({
    _id: {type: String, required: true},
    counter: {type: Number, default: 1},
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

counterSchema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Invoice_Number_Counter', counterSchema);

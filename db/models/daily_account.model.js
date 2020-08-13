const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    cashInCounter: {type: Number},
    openingCash: {type: Number},
    createdDate: {type: Date, unique: true, required: true},
    updatedDate: {type: Date, required: true},
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('DailyAccount', schema);

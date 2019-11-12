const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    role: {type: String, required: true},
    code: {type: String, required: true},
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Role', schema);

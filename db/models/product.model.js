const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    code: {type: String, required: true, unique: true},
    name: {type: String, required: true, unique: true},
    // weight: {type: Number, required: true, default: 0},
    units: [{
        position: {type: Number, required: true, unique: true, default: 0},
        unit: {type: Schema.Types.ObjectId, ref: 'Unit', required: true},
        rate: {type:Number, required: true},
        // rateWith1: {type: Number, required:true}
    }],
    vendor: {type: Schema.Types.ObjectId, ref: 'Vendor', required: true},
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('Product', schema);

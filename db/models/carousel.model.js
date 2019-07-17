const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    archive: { type: Boolean, required: true, default: false },
    imageUrl: {type: String, required: true}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Carousel', schema);
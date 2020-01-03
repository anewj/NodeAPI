const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    sidebarColor: {type: String, required: true},
    dashboardColor: {type: String, required: true},
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('UserSettings', schema);

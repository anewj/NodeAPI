const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    role_id: {type: Schema.Types.ObjectId, ref: 'Role'},
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

schema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('User_Role', schema);

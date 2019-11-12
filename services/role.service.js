const db = require('../_helpers/db');
const Role = db.Role;

module.exports = {
    create,
    getAll,
    getById,
    getByCode
};
async function create(roleParam) {
    // save product
    const role = new Role(roleParam);
    await role.save();
    return role;
}

async function getAll() {
    return await Role.find();
}

async function getById(id) {
    if(db.mongoose.Types.ObjectId.isValid(id))
        return await Role.findById(id);
    else
        return {};
}

async function getByCode(code) {
    return await Role.findOne({ 'code': code });
}

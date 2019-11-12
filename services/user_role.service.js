const db = require('../_helpers/db');
const User_Role = db.UserRole;

module.exports = {
    create,
    getAll,
    getById
};
async function create(user_roleParam) {
    // save user role
    const user_role = new User_Role(user_roleParam);
    await user_role.save();
    return user_role;
}

async function getAll() {
    return await User_Role.find();
}

async function getById(id) {
    if(db.mongoose.Types.ObjectId.isValid(id))
        return await User_Role.findById(id);
    else
        return {};
}

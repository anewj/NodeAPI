const db = require('../_helpers/db');
const UserSettings = db.UserSettings;
const mongoose = require('mongoose');

module.exports = {
    create,
    getAll,
    getProduct,
    getByUserId,
    getByManufacturer,
};

async function create(settingsParams) {
    const userSettings = await UserSettings.findOne({user_id: settingsParams.user_id});
    if (!userSettings) {
        // save product
        settingsParams._id = new mongoose.Types.ObjectId();
        const settings = new UserSettings(settingsParams);
        await settings.save();
        return settings;
    } else {
        Object.assign(userSettings, settingsParams);
        await userSettings.save();
        return userSettings
    }
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({username: userParam.username})) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function getAll() {
    return await UserSettings.find();
}

async function getProduct(preOrder) {
    return await UserSettings.find({preOrder: preOrder});
}

async function getByUserId(id) {
    if (db.mongoose.Types.ObjectId.isValid(id))
        return await UserSettings.find({user_id: id});
    else
        return {};
}

async function getByManufacturer(data) {
    return await Product.find(data);
}


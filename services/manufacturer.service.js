const db = require('../_helpers/db');
const Manufacturer = db.Manufacturer;

module.exports = {
    create,
    getAll,
    get,
};
async function create(Param) {
    // save manufacturer
    const manufacturer = new Manufacturer(Param);

    await manufacturer.save();
    return manufacturer;
}

async function getAll() {
    return await Manufacturer.find();
}

async function get(id) {
    return await Manufacturer.findById(id);
}
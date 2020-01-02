const db = require('../_helpers/db');
const Vendor = db.Vendor;
const mongoose = require('mongoose');

module.exports = {
    create,
    getAll,
    getVendor,
    getById,
};
async function create(vendorParam) {
    // save product
    // productParam._id = new mongoose.Types.ObjectId();
    const vendor = new Vendor(vendorParam);

    // console.log(productParam)
    // product._id = new mongoose.Types.ObjectId();
    await vendor.save();
    return vendor;
}

async function getAll() {
    return await Vendor.find();
}

async function getVendor(preOrder) {
    return await Vendor.find({preOrder: preOrder});
}

async function getById(id) {
    if(db.mongoose.Types.ObjectId.isValid(id))
        return await Vendor.findById(id);
    else
        return {};
}

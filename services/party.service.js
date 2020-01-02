const db = require('../_helpers/db');
const Party = db.Party;
const mongoose = require('mongoose');

module.exports = {
    create,
    getAll,
    getProduct,
    getById,
};
async function create(partyParam) {
    // save product
    // productParam._id = new mongoose.Types.ObjectId();
    const party = new Party(partyParam);

    // console.log(productParam)
    // product._id = new mongoose.Types.ObjectId();
    await party.save();
    return party;
}

async function getAll() {
    return await Party.find();
}

async function getProduct(preOrder) {
    return await Party.find({preOrder: preOrder});
}

async function getById(id) {
    if(db.mongoose.Types.ObjectId.isValid(id))
        return await Party.findById(id);
    else
        return {};
}

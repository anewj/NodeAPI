const db = require('../_helpers/db');
const Party = db.Party;
const mongoose = require('mongoose');

module.exports = {
    create,
    getAll,
    getProduct,
    getById,
    bulkSave,
};

async function create(partyParam) {
    // save product
    // productParam._id = new mongoose.Types.ObjectId();
    const party = new Party(partyParam);

    // console.log(productParam)
    // product._id = new mongoose.Types.ObjectId();
    const promise = new Promise((resolve, reject) => {
        party.save().then(record => {
            resolve(record)
        }).catch(err => {
            reject(err);
        });
    });
    return await promise;
}

async function getAll() {
    return await Party.find();
}

async function getProduct(preOrder) {
    return await Party.find({preOrder: preOrder});
}

async function getById(id) {
    if (db.mongoose.Types.ObjectId.isValid(id))
        return await Party.findById(id);
    else
        return {};
}

async function bulkSave(parties) {
    let returnJson = {
        success: [],
        fail: []
    }
    const promise = new Promise(resolve => {
        parties.forEach((party, index, array) => {
            const newParty = new Party(party);
            newParty.save().then(success => {
                returnJson.success.push(success);
                if (index === array.length - 1) resolve(returnJson);
            }).catch(err => {
                returnJson.fail.push(err);
                if (index === array.length - 1) resolve(returnJson);
            })
        })
    })
    return await promise;

}

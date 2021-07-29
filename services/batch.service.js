const db = require('../_helpers/db');
const Batch = db.Batch;
const mongoose = require('mongoose');

module.exports = {
    create,
    getById,
    getByProductId,
    getByCode
}

async function create(batchParam){
    // const batch = Batch.create()
    const batch = new Batch(batchParam)
    await batch.save();
    return batch;
}

async function getById(id){
    if(db.mongoose.Types.ObjectId.isValid(id))
        return await Batch.findById(id).populate(['product_id']);
    else
        return {};
}

async function getByProductId(id){
    if(db.mongoose.Types.ObjectId.isValid(id))
        return await Batch.find({product_id: id}).populate(['product_id']);
    else
        return {};
}

async function getByCode(code){
    return await Batch.find({code: {$regex: code}}).populate(['product_id']);
}
const db = require('../_helpers/db');
const StockLocation = db.StockLocation;
const mongoose = require('mongoose');

module.exports = {
    create,
    getAll,
    getProduct,
    getById,
};
async function create(stockLocationParam) {
    // save product
    // productParam._id = new mongoose.Types.ObjectId();
    const stockLocation = new StockLocation(stockLocationParam);

    // console.log(productParam)
    // product._id = new mongoose.Types.ObjectId();
    await stockLocation.save();
    return stockLocation;
}

async function getAll() {
    return await StockLocation.find();
}

async function getProduct(preOrder) {
    return await StockLocation.find({preOrder: preOrder});
}

async function getById(id) {
    if(db.mongoose.Types.ObjectId.isValid(id))
        return await StockLocation.findById(id);
    else
        return {};
}

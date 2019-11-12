const db = require('../_helpers/db');
const Stock = db.Stock;

module.exports = {
    create,
    getAll,
    getById,
};
async function create(stockParam) {
    // save product
    const stock = new Stock(stockParam);
    await stock.save();
    return stock;
}

async function getAll() {
    return await Stock.find();
}

async function getById(id) {
    if(db.mongoose.Types.ObjectId.isValid(id))
        return await Stock.findById(id).populate({path: 'manufacturer', select: 'manufacturer'});
    else
        return {};
}
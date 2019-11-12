const db = require('../_helpers/db');
const Price = db.Price;

module.exports = {
    create,
    getAll,
    getById,
};
async function create(priceParam) {
    // save product
    const price = new Price(priceParam);
    await price.save();
    return price;
}

async function getAll() {
    return await Price.find();
}

async function getById(id) {
    if(db.mongoose.Types.ObjectId.isValid(id))
        return await Price.findById(id).populate({path: 'manufacturer', select: 'manufacturer'});
    else
        return {};
}
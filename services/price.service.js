const db = require('../_helpers/db');
const Price = db.Price;

module.exports = {
    create,
    getAll,
    getById,
    getByProductId
};
async function create(priceParam) {
    // save product
    const price = new Price(priceParam);
    await price.save();
    return price;
}

async function getAll() {
    return await Price.find().populate(['product_id','unit_id']);
}

async function getById(id) {
    if(db.mongoose.Types.ObjectId.isValid(id))
        return await Price.findById(id).populate({path: 'manufacturer', select: 'manufacturer'});
    else
        return {};
}

async function getByProductId(id) {
    if (db.mongoose.Types.ObjectId.isValid(id))
        return await Price.findOne({product_id: {_id: id}});
    else
        return {};
}

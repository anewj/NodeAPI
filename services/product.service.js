const db = require('../_helpers/db');
const Product = db.Product;

module.exports = {
    create,
    getAll,
    getProduct,
    getById,
    getByManufacturer,
};
async function create(productParam) {
    // save product
    const product = new Product(productParam);
    await product.save();
    return product;
}

async function getAll() {
    return await Product.find();
}

async function getProduct(preOrder) {
    return await Product.find({preOrder: preOrder});
}

async function getById(id) {
    if(db.mongoose.Types.ObjectId.isValid(id))
        return await Product.findById(id).populate({path: 'manufacturer', select: 'manufacturer'});
    else
        return {};
}

async function getByManufacturer(data) {
    return await Product.find(data);
}
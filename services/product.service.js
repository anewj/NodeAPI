const db = require('../_helpers/db');
const Product = db.Product;
const Price = db.Price;
const Stock = db.Stock;
const priceService = require('services/price.service');
const mongoose = require('mongoose');

module.exports = {
    create,
    getAll,
    getProduct,
    getById,
    getByManufacturer,
    getStock,
    getPrice,
};

async function create(productParam) {
    // save product
    // productParam._id = new mongoose.Types.ObjectId();
    const product = new Product(productParam);

    // console.log(productParam)
    // product._id = new mongoose.Types.ObjectId();
    await product.save();
    return product;
}

async function getAll() {
    return await Product.find().populate(['units.unit', 'vendor']);
}

async function getProduct(preOrder) {
    return await Product.find({preOrder: preOrder});
}

async function getById(id) {
    if (db.mongoose.Types.ObjectId.isValid(id)) {
        return await new Promise((resolve, reject) =>
            Product.findById(id).populate(['units.unit', 'vendor']).lean().exec(function (err, product) {
                getPrice(id).then(productPrice =>
                    getStock(id).then(productStock => {
                            product.price = productPrice;
                            product.stock = productStock;
                            resolve(product);
                        }
                    ).catch(err => {
                        console.log(err);

                        let error_data = [];
                        for (data in err.errors) {
                            error_data.push(
                                err.errors[data]
                            )
                        }
                    })).catch(err => {
                    console.log(err)

                    let error_data = [];
                    for (data in err.errors) {
                        error_data.push(
                            err.errors[data]
                        )
                    }
                })
            })
        )
    } else
        return {};
}

async function getStock(id) {
    if (db.mongoose.Types.ObjectId.isValid(id))
        return await Stock.findOne({product_id: {_id: id}}).populate(['unit_id']);
    else
        return {};
}

async function getPrice(id) {
    if (db.mongoose.Types.ObjectId.isValid(id))
        return await Price.findOne({product_id: {_id: id}}).populate(['unit_id']);
    else
        return {};
}

async function getByManufacturer(data) {
    return await Product.find(data);
}

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
    update,
    saveBulkProduct,
    getByPagingSortingFiltering,
    getProductsCount
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

async function update(productParam) {
    // save product
    const product = new Product(productParam);
    return Product.findOneAndUpdate({_id: productParam._id}, product);
}

async function getAll(skip, limit) {
    return Product.find()
        .populate(['units.unit', 'vendor', 'defaultSellingUnit'])
        .sort({code: 1})
        .skip(0)
        .limit(0);
}

async function getProduct(preOrder) {
    return await Product.find({preOrder: preOrder});
}

async function getProductsCount() {
    return await Product.countDocuments();
}

async function getByPagingSortingFiltering(paging) {
    return await new Promise((resolve, reject) => {
            let sortObj = {}
            if (paging.orderDir && paging.orderBy)
                sortObj[paging.orderBy] = (paging.orderDir === 'asc') ? 1 : -1;

            const query = [
                {
                    '$match': {
                        '$or': [
                            {
                                'name': {
                                    '$regex': paging.searchBy,
                                    '$options': 'i'
                                }
                            }, {
                                'code': {
                                    '$regex': paging.searchBy,
                                    '$options': 'i'
                                }
                            }
                        ]
                    }
                },
                {
                    '$unwind': {
                        'path': '$units'
                    }
                },
                {
                    '$lookup': {
                        'from': 'units',
                        'localField': 'units.unit',
                        'foreignField': '_id',
                        'as': 'units.unit'
                    }
                },
                {
                    '$lookup': {
                        'from': 'vendors',
                        'localField': 'vendor',
                        'foreignField': '_id',
                        'as': 'vendor'
                    }
                },
                {
                    '$unwind': {
                        'path': '$units.unit'
                    }
                },
                {
                    '$unwind': {
                        'path': '$vendor'
                    }
                },
                {
                    '$group': {
                        '_id': '$_id',
                        'root': {
                            '$mergeObjects': '$$ROOT'
                        },
                        'units': {
                            '$push': '$units'
                        }
                    }
                },
                {
                    '$replaceRoot': {
                        'newRoot': {
                            '$mergeObjects': [
                                '$root', '$$ROOT'
                            ]
                        }
                    }
                },
                {
                    '$project': {
                        'root': 0
                    }
                }
            ];

            Product.aggregate(query)
                .sort(sortObj)
                .skip(Number(paging.pageNumber) * Number(paging.size))
                .limit(Number(paging.size))
                .exec(function (err, prod) {
                    if (err)
                        reject(err);
                    resolve({
                        page: paging.pageNumber,
                        data: prod
                    })
                });
        }
    )
}

async function getById(id) {
    if (db.mongoose.Types.ObjectId.isValid(id)) {
        return await new Promise((resolve, reject) =>
            Product.findById(id).populate(['units.unit', 'vendor', 'defaultSellingUnit']).lean().exec(function (err, product) {
                getPrice(id).then(productPrice =>
                    getStock(id).then(productStock => {
                            product.price = productPrice;
                            product.stock = productStock;
                            resolve(product);
                        }
                    ).catch(err => {
                        let error_data = [];
                        for (data in err.errors) {
                            error_data.push(
                                err.errors[data]
                            )
                        }
                    })).catch(err => {
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

async function saveBulkProduct(data) {
    let resp = {
        success: [],
        fail: []
    }
    return new Promise(resolve => {
        data.forEach((product, index, array) => {
            const newProduct = new Product(product);
            let respJson = {};
            respJson.code = product.code;
            newProduct.save().then(res => {
                respJson.id = res._id;
                const pricePromise = new Promise((resolve1, reject1) => {
                    product.price.product_id = res._id;
                    const newPrice = new Price(product.price);
                    newPrice.save().then(np => resolve1(np)).catch(pErr => reject1(pErr))
                })
                const stockPromise = new Promise((resolve2, reject2) => {
                    product.stock.product_id = res._id;
                    const newStock = new Stock(product.stock);
                    newStock.save().then(ns => resolve2(ns)).catch(sErr => reject2(sErr))
                })
                Promise.all([pricePromise, stockPromise]).then(values => {
                    respJson.successPriceStock = values
                    resp.success.push(respJson);
                    checkCallBack(index, array);
                }).catch(err => {
                    respJson.errors = err
                    resp.fail.push(respJson);
                    checkCallBack(index, array);
                })
            }).catch(err => {
                respJson.errors = err.errors;
                respJson.message = err._message;
                respJson.all = err;
                resp.fail.push(respJson);
                checkCallBack(index, array);
            });
        })

        function checkCallBack(index, array) {
            if (index === array.length - 1) {
                resolve(resp);
            }

        }
    });
}

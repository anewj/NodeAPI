const db = require('../_helpers/db');
const Price = db.Price;
const Product = db.Product;
const Unit = db.Unit;

module.exports = {
    create,
    getAll,
    getById,
    getByProductId,
    update,
    updateBulk
};

async function create(priceParam) {
    // save product
    const price = new Price(priceParam);
    await price.save();
    return price;
}

async function update(priceParam) {
    const price = new Price(priceParam);
    Price.findOneAndUpdate({_id: priceParam._id}, price).then(res => {
        console.log('here')
        console.log(res)
    }).catch(err => {
        console.log('there')
        console.log(err)
    });
}

async function getAll() {
    return Price.find().populate(['product_id', 'unit_id']);
}

async function getById(id) {
    if (db.mongoose.Types.ObjectId.isValid(id))
        return Price.findById(id).populate({path: 'manufacturer', select: 'manufacturer'});
    else
        return {};
}

async function getByProductId(id) {
    if (db.mongoose.Types.ObjectId.isValid(id))
        return Price.findOne({product_id: {_id: id}});
    else
        return {};
}

/**
 * Update price and price unit in bulk
 * @param priceParams - array of prices
 * @returns {Promise<Object>} - result
 */
async function updateBulk(priceParams) {
    // return object
    const result = {
        success: [],
        fail: []
    }
    let counter = 0;

    return await new Promise(RESOLVE=> {
        priceParams.forEach(price => {
            let retrievedProduct = {};

            // Find product by code and resolve
            const productFindPromise = new Promise((resolve, reject) =>
                Product.findOne({code: price.productCode}).then(p => {
                    if (p) {
                        retrievedProduct = p;
                        resolve();
                    } else reject('no product found with this code');
                }).catch(err => reject(err)))

            // If product is found then proceed with price update
            productFindPromise.then(() => {
                let priceUpdateJson = {};
                // Search unit to change if it is provided in json, resolve if found or no unit, reject if any errors
                const unitFindPromise = new Promise(((resolve, reject) => {
                    if (price?.unitName) {
                        Unit.findOne({name: price.unitName.toUpperCase()}).then(unit => {
                            if (unit) {
                                const filterUnit = retrievedProduct.units.filter(u => u.unit.toString() === unit._id.toString());
                                if (filterUnit.length === 1) {
                                    priceUpdateJson.unit_id = filterUnit[0].unit.toString();
                                    resolve();
                                } else reject(`product does not have this unit => ${price.unitName}`)
                            } else reject('no unit found with this name')
                        }).catch(err => reject(err))
                    } else resolve();
                }))

                // after unit is resolved, update price
                unitFindPromise.then(() => {
                    priceUpdateJson.price = price.price;
                    Price.findOneAndUpdate({product_id: retrievedProduct._id}, priceUpdateJson, {new: true}).then(pr => {
                        pushSuccess(price.productCode, pr)
                    }).catch(unitFindPromiseErr => pushError(price.productCode, unitFindPromiseErr))
                }).catch(unitFindPromiseErr => pushError(price.productCode, unitFindPromiseErr))
            }).catch(err => pushError(price.productCode, err))
        })
        // If operation has error, push error and product code into array to return.
        function pushError(productCode, error) {
            result.fail.push({
                productCode: productCode,
                error: error
            });
            return checkOp();
        }

        // If operation has passed, push new data into array to return.
        function pushSuccess(productCode, error) {
            result.success.push({
                productCode: productCode,
                data: error
            });
            return checkOp();
        }

        //Resolve promise if the counter is same as array length
        function checkOp() {
            counter++;
            if (counter === priceParams.length)
                RESOLVE (result);
        }
    })
}

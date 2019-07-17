const db = require('../_helpers/db');
const Cart = db.Cart;

module.exports = {
    create,
    getById
};

async function create(cartParams) {

    var invalidProductId = [];
    if (db.mongoose.Types.ObjectId.isValid(cartParams.user)) {
        cartParams.items.forEach(function (item) {
            if (db.mongoose.Types.ObjectId.isValid(item.product)) {
            } else {
                invalidProductId.push({message: "invalid product ID", product_id: item.product})
            }
        });
    }
    else
        return {message: "invalid user id"};

    if (invalidProductId.length > 0)
        return invalidProductId;

    var retrievedCart = await Cart.find({user: cartParams.user});
    if (retrievedCart == null) {
        console.log("save new");
        const cart = new Cart(cartParams);
        await cart.save();
        return cart;
    } else {
        console.log("update cart");
        console.log(retrievedCart.user);
        retrievedCart.items.forEach(function (retrievedItem) {
            retrievedProducts.push(retrievedItem.product);
        });
        cartParams.items.forEach(function (item) {
           if(retrievedProducts.includes(item)) {
                
           }
        });
    }
    return {};

}

async function getById(id) {
    if (db.mongoose.Types.ObjectId.isValid(id))
        return await Cart.find({user: id});
    else
        return {};
}

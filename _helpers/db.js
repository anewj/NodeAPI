const config = require('config/config.json');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
// mongoose.connect(process.env.MONGODB_URI || config.connectionString, {dbName: 'billingSystem', useCreateIndex: true, useNewUrlParser: true }, function (error) {
//     console.log(error);
// });
mongoose.Promise = global.Promise;mongoose.Promise = global.Promise;

module.exports = {
    mongoose: mongoose,
    User: require('../db/models/user.model'),
    Product: require('../db/models/product.model'),
    Carousel: require('../db/models/carousel.model'),
    Manufacturer: require('../db/models/manufacturer'),
    Stock: require('../db/models/stock.model'),
    Price: require('../db/models/price.model'),
    Cart: require('../db/models/cart.model'),
    Role: require('../db/models/role.model'),
    UserRole: require('../db/models/user_role.model'),
};
const config = require('config/config.json');
const mongoose = require('mongoose');

const options = {
    autoIndex: false, // Don't build indexes
    reconnectTries: 30, // Retry up to 30 times
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    useCreateIndex: true,
    useNewUrlParser: true
};

const connectWithRetry = () => {
    console.log('MongoDB connection with retry');
    mongoose.connect(process.env.MONGODB_URI || config.connectionString, options).then(() => {
        console.log('MongoDB is connected')
    }).catch(err => {
        console.log('MongoDB connection unsuccessful, retry after 5 seconds.');
        setTimeout(connectWithRetry, 5000)
    })
};

connectWithRetry();

// mongoose.connect(process.env.MONGODB_URI || config.connectionString, {useCreateIndex: true, useNewUrlParser: true});
// mongoose.connect(process.env.MONGODB_URI || config.connectionString, {dbName: 'billingSystem', useCreateIndex: true, useNewUrlParser: true }, function (error) {
//     console.log(error);
// });
mongoose.Promise = global.Promise;

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
    Unit: require('../db/models/unit.model'),
    Vendor: require('../db/models/vendor.model'),
    Party: require('../db/models/party.model'),
    StockLocation: require('../db/models/stock_location.model'),
    UserSettings: require('../db/models/user_settings.model'),
    CompanySettings: require('../db/models/company_settings.model'),
    InvoiceNumber: require('../db/models/tax_invoice_counter.model'),
    Invoice: require('../db/models/tax_invoice.model'),
    InvoiceDump: require('../db/models/invoice_dump.model'),
    SalesDetail: require('../db/models/sales_detail.model'),
    DailyAccount: require('../db/models/daily_account.model'),
    Cheque: require('../db/models/cheque.model'),
};

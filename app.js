require('rootpath')();

const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');

//import routers
const usersRouter = require('./routes/controllers/users.controller');
const priceRouter = require('./routes/controllers/price.controller');
const roleRouter = require('./routes/controllers/role.controller');
const user_roleRouter = require('./routes/controllers/user_role.controller');
const productRouter = require('./routes/controllers/products.controller');
const carouselRouter = require('./routes/controllers/carousel.controller');
const manufacturerRouter = require('./routes/controllers/manufacturers.controller');
const cartRouter = require('./routes/controllers/cart.controller');
const unitRouter = require('./routes/controllers/unit.controller');
const stockRouter = require('./routes/controllers/stock.controller');
const vendorRouter = require('./routes/controllers/vendor.controller');
const partyRouter = require('./routes/controllers/party.controller');
const stock_locationRouter = require('./routes/controllers/stock_location.controller');
const user_settingsRouter = require('./routes/controllers/user_settings.controller');
const company_settingsRouter = require('./routes/controllers/company_settings.controller');
const invoiceRouter = require('./routes/controllers/invoice.controller');
const dailyAccountRouter = require('./routes/controllers/daily_account.controller');
const chequeRouter = require('./routes/controllers/cheque.controller');
const panNumberRouter = require('./routes/controllers/pan_number.controller');
const loaderRouter = require('./routes/controllers/loader.controller');
const batchRouter = require('./routes/controllers/batch.controller');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// DOC for swaggerUI
const swaggerDocs = swaggerJsDoc({
    swagger: "2.0",
    swaggerDefinition: {
        openapi: '3.0.3',
        info: {
            title: "ERP API",
            version: '0.1',
            description: 'Api documentation for the ERP API',
            contact: {
                name: 'Logispark Technologies Pvt. Ltd. / Detech Solution Pvt. Ltd.'
            }
        },
        components: {
            securitySchemes: {
                jwt: {
                    type: 'http',
                    scheme: 'bearer',
                    in: 'header',
                    // bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            jwt: []
        }],
    },
    apis: ["./routes/controllers/*.js"],
});

// swagger options
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
}
// console.log(swaggerDocs)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerOptions));

// Serve swagger docs the way you like (Recommendation: swagger-tools)
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
// app.use(jwt());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//define router paths
// app.use("/", function (req, res) {
//     // res.send("Authenticate user to use API.")
//     res.send("register User from : '/users/authenticate' or register from '/users/register'")
// });
app.use('/users', usersRouter);
app.use('/unit', unitRouter);
app.use('/userRoles', user_roleRouter);
app.use('/price', priceRouter);
app.use('/role', roleRouter);
app.use('/products',productRouter);
app.use('/carousel',carouselRouter);
app.use('/manufacturer',manufacturerRouter);
app.use('/cart',cartRouter);
app.use('/stock',stockRouter);
app.use('/vendor',vendorRouter);
app.use('/party',partyRouter);
app.use('/stock_location',stock_locationRouter);
app.use('/user_settings',user_settingsRouter);
app.use('/company_settings',company_settingsRouter);
app.use('/invoice',invoiceRouter);
app.use('/dailyAccount',dailyAccountRouter);
app.use('/cheque',chequeRouter);
app.use('/pan',panNumberRouter);
app.use('/load',loaderRouter)
app.use('/batch', batchRouter);

//API Error Handler
app.use(errorHandler);

module.exports = app;

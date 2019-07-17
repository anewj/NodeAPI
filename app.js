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
const productRouter = require('./routes/controllers/products.controller');
const carouselRouter = require('./routes/controllers/carousel.controller');
const manufacturerRouter = require('./routes/controllers/manufacturers.controller');
const cartRouter = require('./routes/controllers/cart.controller');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//define router paths
app.use('/users', usersRouter);
app.use('/products',productRouter);
app.use('/carousel',carouselRouter);
app.use('/manufacturer',manufacturerRouter);
app.use('/cart',cartRouter);

//API Error Handler
app.use(errorHandler);

module.exports = app;
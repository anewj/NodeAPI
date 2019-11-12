const express = require('express');
const router = express.Router();
const productService = require('services/product.service');
const priceService = require('services/price.service');
const stockService = require('services/stock.service');
const mongoose = require('mongoose');
const authorize = require('_helpers/authorize');


var fs = require('fs');

// routes
router.post('/new', newProduct);
router.get('/', getAllProducts);
router.get('/:id', getById);
router.get('/query/:field&:id', getByManufacturer);
router.get('/preOrder/:preOrder', getProducts);

module.exports = router;

function getAllProducts(req, res, next) {
    productService.getAll()
        .then(product => res.json(product))
        .catch(err => next(err));
}

function newProduct(req, res, next) {
    productService.create(req.body)
        .then(productData => {
            var priceJson = {
                product_id: productData._id,
                price: req.body.price
            };
            priceService.create(priceJson)
                .then(priceData => {
                    var stockJson = {
                        product_id: productData._id,
                        quantity: req.body.quantity
                    };
                    stockService.create(stockJson)
                        .then(stockData => {
                            let resultJson = {};
                            resultJson["_id"] = productData._id;
                            resultJson["name"] = productData.name;
                            resultJson["code"] = productData.code;
                            resultJson["weight"] = productData.weight;
                            resultJson["price"] = priceData;
                            resultJson.quantity = stockData;

                            res.json(resultJson);
                        })
                        .catch(err => next(err));
                })
                .catch(err => next(err));
        })
        .catch(err => next(err));
}

function getProducts(req, res, next) {
    productService.getProduct(req.params.preOrder)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    productService.getById(req.params.id)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}

function getByManufacturer(req, res, next) {

    var query ={};
    query[req.params.field] = req.params.id;

    productService.getByManufacturer(query)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}

const express = require('express');
const router = express.Router();
const productService = require('services/product.service');
const priceService = require('services/price.service');
const stockService = require('services/stock.service');
const mongoose = require('mongoose');
const authorize = require('_helpers/authorize');


var fs = require('fs');

// routes
router.post('/', newProduct);
router.get('/', getAllProducts);
router.get('/count', getProductsCount);
router.get('/psf', getByPagingSortingFiltering);
router.get('/query/:field&:id', getByManufacturer);
router.get('/preOrder/:preOrder', getProducts);
router.get('/stock/:id', getStock);
router.get('/price/:id', getPrice);
router.get('/:id', getById);
router.post('/update', updateProduct);
router.post('/bulk', saveBulkProducts);

module.exports = router;

function getAllProducts(req, res, next) {
    productService.getAll()
        .then(product => {
            res.json(product)
        })
        .catch(err => next(err));
}

function newProduct(req, res, next) {
    productService.create(req.body)
        .then(productData => {
            res.json(productData);
        })
        .catch(err=> {
            console.log(err)

            let error_data = [];
            for(data in err.errors) {
                error_data.push(
                    err.errors[data]
                )
            }

            return res.status(400).send({message: error_data})
        })
}

function getProducts(req, res, next) {
    productService.getProduct(req.params.preOrder)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}
function getProductsCount(req, res, next) {
    productService.getProductsCount(req.params.preOrder)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}

function getByPagingSortingFiltering(req, res, next) {
    productService.getByPagingSortingFiltering(req.query)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    productService.getById(req.params.id)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}

function getStock(req, res, next) {
    productService.getStock(req.params.id)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}

function getPrice(req, res, next) {
    productService.getPrice(req.params.id)
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

function updateProduct(req, res, next) {
    productService.update(req.body)
        .then(productData => {
            res.json(productData);
        })
        .catch(err=> {
            console.log(err);

            let error_data = [];
            for(data in err.errors) {
                error_data.push(
                    err.errors[data]
                )
            }

            return res.status(400).send({message: error_data})
        })
}

function saveBulkProducts(req, res, next) {
    productService.saveBulkProduct(req.body)
        .then(productData => {
            res.json(productData);
        })
        .catch(err=> {
            console.log(err)

            let error_data = [];
            for(data in err.errors) {
                error_data.push(
                    err.errors[data]
                )
            }

            return res.status(400).send({message: error_data})
        })
}

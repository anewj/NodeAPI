const express = require('express');
const router = express.Router();
const productService = require('services/product.service');
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
        .then(data => res.json(data))
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
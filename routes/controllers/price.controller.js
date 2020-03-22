const express = require('express');
const router = express.Router();
const priceService = require('services/price.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.post('/', insertPrice);
router.get('/', getAllPrices);
router.get('/:id', getById);

module.exports = router;

function getAllPrices(req, res, next) {
    priceService.getAll()
        .then(product => res.json(product))
        .catch(err => next(err));
}

function insertPrice(req, res, next) {
    priceService.create(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getById(req, res, next) {
    priceService.getByProductId(req.params.id)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}

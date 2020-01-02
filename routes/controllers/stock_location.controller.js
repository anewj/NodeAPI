const express = require('express');
const router = express.Router();
const stockLocationService = require('services/stock_location.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.post('/', insertStockLocation);
router.get('/', getAllStocksLocation);
router.get('/:id', getById);

module.exports = router;

function getAllStocksLocation(req, res, next) {
    stockLocationService.getAll()
        .then(stock => res.json(stock))
        .catch(err => next(err));
}

function insertStockLocation(req, res, next) {
    stockLocationService.create(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getById(req, res, next) {
    stockLocationService.getById(req.params.id)
        .then(stock => stock ? res.json(stock) : res.sendStatus(404))
        .catch(err => next(err));
}

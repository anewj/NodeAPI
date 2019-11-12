const express = require('express');
const router = express.Router();
const stockService = require('services/stock.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.post('/', insertStock);
router.get('/', getAllStocks);
router.get('/:id', getById);

module.exports = router;

function getAllStocks(req, res, next) {
    stockService.getAll()
        .then(stock => res.json(stock))
        .catch(err => next(err));
}

function insertStock(req, res, next) {
    stockService.create(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getById(req, res, next) {
    stockService.getById(req.params.id)
        .then(stock => stock ? res.json(stock) : res.sendStatus(404))
        .catch(err => next(err));
}

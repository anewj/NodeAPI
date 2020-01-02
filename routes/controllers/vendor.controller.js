const express = require('express');
const router = express.Router();
const vendorService = require('services/vendor.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.post('/', insertVendor);
router.get('/', getAllVendors);
router.get('/:id', getById);

module.exports = router;

function getAllVendors(req, res, next) {
    vendorService.getAll()
        .then(stock => res.json(stock))
        .catch(err => next(err));
}

function insertVendor(req, res, next) {
    vendorService.create(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getById(req, res, next) {
    vendorService.getById(req.params.id)
        .then(stock => stock ? res.json(stock) : res.sendStatus(404))
        .catch(err => next(err));
}

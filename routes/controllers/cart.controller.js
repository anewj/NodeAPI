const express = require('express');
const router = express.Router();
const cartService = require('services/cart.service');
var fs = require('fs');

// routes
router.post('/', newProduct);
// router.get('/', getAllProducts);
router.get('/:id', getById);

module.exports = router;


function newProduct(req, res, next) {
    cartService.create(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}


function getById(req, res, next) {
    cartService.getById(req.params.id)
        .then(cart => cart ? res.json(cart) : res.sendStatus(404))
        .catch(err => next(err));
}


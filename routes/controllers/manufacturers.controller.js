const express = require('express');
const router = express.Router();
const manufacturerService = require('services/manufacturer.service');
var fs = require('fs');

// routes
router.post('/', add);
router.get('/', getAll);
router.get('/:id', getById);

module.exports = router;


function getAll(req, res, next) {
    manufacturerService.getAll()
        .then(manufacturer => res.json(manufacturer))
        .catch(err => next(err));
}

function add(req, res, next) {
    manufacturerService.create(req.body)
        .then(data => {
            res.json(data);
        })
        .catch(err => next(err));
}

function getById(req, res, next) {
    manufacturerService.get(req.params.id)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}
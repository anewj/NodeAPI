const express = require('express');
const router = express.Router();
const unitService = require('services/unit.service');
const authorize = require('_helpers/authorize');
const Role = require('_helpers/role');

var fs = require('fs');

// routes
router.post('/',authorize([Role.Admin, Role.SuperAdmin]) , insertUnit);
router.get('/', getAllUnits);
router.get('/:id', getById);

module.exports = router;

function getAllUnits(req, res, next) {
    unitService.getAll()
        .then(unit => res.json(unit))
        .catch(err => next(err));
}

function insertUnit(req, res, next) {
    unitService.create(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getById(req, res, next) {
    unitService.getById(req.params.id)
        .then(unit => unit ? res.json(unit) : res.sendStatus(404))
        .catch(err => next(err));
}

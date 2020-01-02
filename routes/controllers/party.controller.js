const express = require('express');
const router = express.Router();
const partyService = require('services/party.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.post('/', insertParty);
router.get('/', getAllParty);
router.get('/:id', getById);

module.exports = router;

function getAllParty(req, res, next) {
    partyService.getAll()
        .then(stock => res.json(stock))
        .catch(err => next(err));
}

function insertParty(req, res, next) {
    partyService.create(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

function getById(req, res, next) {
    partyService.getById(req.params.id)
        .then(stock => stock ? res.json(stock) : res.sendStatus(404))
        .catch(err => next(err));
}

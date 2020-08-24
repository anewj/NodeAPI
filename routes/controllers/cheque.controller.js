const express = require('express');
const router = express.Router();
const chequeService = require('services/cheque.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.get('/', getAllCheques);
router.post('/', saveCheque);

module.exports = router;

function getAllCheques(req, res, next) {
    chequeService.getAllCheques()
        .then(cheques => res.json(cheques))
        .catch(err => next(err));
}

function saveCheque(req, res, next) {
    chequeService.saveCheque(req.body)
        .then(cheques => res.json(cheques))
        .catch(err => next(err));
}

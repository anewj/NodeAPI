const express = require('express');
const router = express.Router();
const chequeService = require('services/cheque.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.get('/', getAllCheques);
router.get('/group/customer', groupByCustomerId);
router.post('/', saveCheque);
router.put('/', editCheque);
router.get('/getChequesClearedToday', getActionedToday);

module.exports = router;

function getAllCheques(req, res, next) {
    chequeService.getAllCheques()
        .then(cheques => res.json(cheques))
        .catch(err => next(err));
}

function groupByCustomerId(req, res, next) {
    chequeService.groupChequesByCustomerID()
        .then(cheques => res.json(cheques))
        .catch(err => next(err));
}

function saveCheque(req, res, next) {
    chequeService.saveCheque(req.body)
        .then(cheques => res.json(cheques))
        .catch(err => next(err));
}

function editCheque(req, res, next) {
    chequeService.editCheque(req.body)
        .then(cheques => res.json(cheques))
        .catch(err => next(err));
}

//Expect params -> status = value in ["CLEARED","CLEARING"]
function getActionedToday(req, res, next) {
    chequeService.getChequesActionedToday(req)
        .then(cheques => res.json(cheques))
        .catch(err => next(err));
}

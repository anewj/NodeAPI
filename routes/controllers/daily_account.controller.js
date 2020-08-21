const express = require('express');
const router = express.Router();
const dailyAccountService = require('services/daily_account.service');
const authorize = require('_helpers/authorize');

var fs = require('fs');

// routes
router.get('/todaySales', getTodaySales);
router.get('/lastDay', getLastDay);
router.put('/updateCash', saveCashReceived);
// router.get('/invoiceNumber', getInvoiceNumber);
// router.get('/:id', getByUserId);

module.exports = router;

function getTodaySales(req, res, next) {
    dailyAccountService.getTodaySale()
        .then(sales => res.json(sales))
        .catch(err => next(err));
}

function getInvoiceNumber(req, res, next) {
    invoiceService.getInvoiceNumber()
        .then(data => res.json(data))
        .catch(err => next(err));
}
function getLastDay(req, res, next) {
    dailyAccountService.getLastDay()
        .then(data => res.json(data))
        .catch(err => next(err));
}
function saveCashReceived(req, res, next) {
    dailyAccountService.update(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}
